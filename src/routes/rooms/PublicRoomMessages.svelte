<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { DisplayErrors, Icon } from '$lib/components';
	import { initializePusher, type Pusher } from '$lib/pusher-client';
	import MessageInput from './MessageInput.svelte';
	import { getBackendHeaders, backendUrl } from '$lib/constants';
	import { slide } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import type { Message, User } from '@prisma/client';
	import { fromNow } from '$lib/helpers';

	export let accessToken: string | null | undefined;
	export let user: User | null | undefined;

	let channel;
	let channelName = 'chat-room';
	let eventName = 'new-message';
	let pusher: Pusher | null;
	let isMounted = false;
	let isConnected = false;
	let errors = null;
	let messages: Message[] = [];

	onMount(() => {
		isMounted = true;
		startListening();
	});

	onDestroy(() => {
		disconnectPusher();
	});

	function startListening() {
		pusher = initializePusher();

		channel = pusher?.subscribe(channelName);

		channel?.bind(eventName, (data) => {
			messages = [...messages, data.message];
		});

		// check if the user is subscribed to the above channel
		channel?.bind('pusher:subscription_succeeded', function (members) {
			isConnected = true;
		});

		pusher?.connection.bind('connected', () => {
			// isConnected = true;
		});

		pusher?.connection.bind('disconnected', () => {
			isConnected = false;
		});

		fetchLatestMessages();
	}

	async function sendMessage(e: CustomEvent<string>) {
		errors = null;
		const resp = await fetch(`${backendUrl}/public`, {
			method: 'POST',
			headers: getBackendHeaders(accessToken),
			body: JSON.stringify({
				message: e.detail
			})
		});

		const json = await resp.json();

		if (!resp.ok) {
			errors = json.errors ?? 'Could not send message';

			setTimeout(() => {
				errors = null;
			}, 3000);
			return;
		}
	}

	async function fetchLatestMessages() {
		const resp = await fetch(`${backendUrl}/public-latest-messages`);

		const json = await resp.json();

		if (resp.ok) {
			messages = [...messages, ...json.data].reverse();
		}
	}

	function disconnectPusher() {
		pusher?.unsubscribe(channelName);
	}
</script>

<div class="relative min-h-[50vh]">
	<div class="flex flex-wrap justify-between gap-4">
		<h4 class="subtitle">Public Chatroom</h4>
		<div class="text-sm" class:text-green-500={isConnected} class:text-red-500={!isConnected}>
			<Icon name="circle" size="sm" />
			{#if isConnected}
				connected
			{:else}
				not connected
			{/if}
		</div>
	</div>

	<!-- chat area -->
	<ul class="relative mt-4">
		{#each messages as item}
			{@const isTheSender = user?.id == item.userId}
			<li class="mb-2">
				<div class="flex w-full" class:justify-end={isTheSender}>
					<div
						class="text-sm px-3 py-2 rounded-lg max-w-[70%]"
						class:bg-gray-100={isTheSender}
						class:bg-blue-100={!isTheSender}
						class:rounded-ee-none={isTheSender}
						class:rounded-es-none={!isTheSender}
					>
						{item.message}
					</div>
				</div>
				<div class="flex w-full" class:justify-end={isTheSender}>
					<small class="text-[10px] text-gray-600" class:hidden={isTheSender}
						>{item.user?.name} &middot;</small
					>
					<small class="text-[10px] italic text-gray-500">{fromNow(item.createdAt)}</small>
				</div>
			</li>
		{/each}
	</ul>

	{#if errors}
		<div
			class="absolute bottom-[40px] left-0 right-0"
			transition:slide={{ axis: 'y', duration: 300, easing: quadOut }}
		>
			<DisplayErrors {errors} />
		</div>
	{/if}

	{#if isMounted}
		<div
			class="absolute bottom-0 left-0 right-0"
			in:slide={{ axis: 'y', duration: 300, easing: quadOut }}
		>
			<MessageInput on:send={sendMessage} />
		</div>
	{/if}
</div>
