<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { DisplayErrors, Icon } from '$lib/components';
	import { initializePusher, type Pusher } from '$lib/pusher-client';
	import MessageInput from './MessageInput.svelte';
	import { getBackendHeaders, backendUrl } from '$lib/constants';
	import { slide } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import type { Message, User } from '@prisma/client';
	import { dateFormat, isDateToday } from '$lib/helpers';
	import { scrollToBottomAction } from 'svelte-legos';

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

	function formatTime(d: Date | null) {
		if (isDateToday(d)) {
			return dateFormat(d, 'hh:mm a');
		}

		return dateFormat(d, 'DD MMM, hh:mm a');
	}
</script>

<div class="card">
	<div class="relative h-[50vh] overflow-auto">
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
		<ul class="h-[35vh] mt-4 overflow-auto" use:scrollToBottomAction>
			{#each messages as item}
				{@const isTheSender = user?.id == item.userId}
				<li class="mb-1 flex flex-wrap gap-2">
					<div class="text-sm italic text-gray-500 dark:text-gray-400">
						{formatTime(item.createdAt)}
					</div>

					<div
						class="text-sm italic"
						class:text-indigo-800={isTheSender}
						class:dark:text-indigo-300={isTheSender}
						class:text-yellow-500={!isTheSender}
						class:dark:text-yellow-400={!isTheSender}
					>
						{item.user?.name}:
					</div>
					<div class="text-sm">
						{item.message}
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
</div>
