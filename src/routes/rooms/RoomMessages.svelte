<script lang="ts">
	import type { Message, Room, User } from '@prisma/client';
	import { onDestroy, onMount } from 'svelte';
	import { Button, DisplayErrors, Icon } from '$lib/components';
	import { initializePusher, type Pusher } from '$lib/pusher-client';
	import { backendUrl, getBackendHeaders } from '$lib/constants';
	import { fromNow } from '$lib/helpers';
	import MessageInput from './MessageInput.svelte';
	import { slide } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';

	export let room: Room;
	export let user: User | null | undefined;
	export let accessToken: string | null | undefined;

	let channel;
	let channelName: string | null = null;
	let eventName = 'new-message';
	let pusher: Pusher | null;
	let isConnected = false;
	let isMounted = false;
	let isListening = false;
	let errors = null;

	let messages: Message[] = [];

	onMount(() => {
		isMounted = true;
	});

	onDestroy(() => {
		disconnectPusher();
	});

	// if the channel name changes, disconnect previous channel,
	// then reconnect to new channel. reset messages also
	$: {
		if (isListening) {
			messages = [];
			disconnectPusher();
			isListening = false;
		}
		channelName = `private-room-${room.id}`;

		if (isMounted && !isListening) startListening();
	}

	$: if (isMounted && !isListening) startListening();

	function startListening() {
		isListening = true;
		pusher = initializePusher(getBackendHeaders(accessToken));

		if (!channelName) return;

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
		const resp = await fetch(`${backendUrl}/message`, {
			method: 'POST',
			headers: getBackendHeaders(accessToken),
			body: JSON.stringify({
				message: e.detail,
				roomId: room?.id
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
		const resp = await fetch(`${backendUrl}/room/${room.id}/latest-messages`);

		const json = await resp.json();

		if (resp.ok) {
			messages = [...messages, ...json.data].reverse();
		}
	}

	function disconnectPusher() {
		console.log('disconnecting pusher...');
		pusher?.unsubscribe(channelName);
	}
</script>

<div class="relative min-h-[50vh]">
	<div class="flex flex-wrap justify-between gap-4">
		<h4 class="subtitle">{room.name}</h4>
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
						class:dark:bg-gray-900={isTheSender}
						class:bg-blue-100={!isTheSender}
						class:dark:bg-blue-900={!isTheSender}
						class:rounded-ee-none={isTheSender}
						class:rounded-es-none={!isTheSender}
					>
						{item.message}
					</div>
				</div>
				<div class="flex w-full" class:justify-end={isTheSender}>
					<small class="text-[10px] text-gray-600 dark:text-gray-400" class:hidden={isTheSender}
						>{item.user?.name} &middot;</small
					>
					<small class="text-[10px] italic text-gray-500 dark:text-gray-400"
						>{fromNow(item.createdAt)}</small
					>
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
