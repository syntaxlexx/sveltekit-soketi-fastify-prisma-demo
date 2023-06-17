<script lang="ts">
	import type { Message, Room, User } from '@prisma/client';
	import { onDestroy, onMount } from 'svelte';
	import { DisplayErrors, Icon } from '$lib/components';
	import { initializePusher, type Pusher } from '$lib/pusher-client';
	import { backendUrl, getBackendHeaders } from '$lib/constants';
	import { convertToJson, fromNow, listify } from '$lib/helpers';
	import MessageInput from './MessageInput.svelte';
	import { fade, slide } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import { scrollToBottomAction } from 'svelte-legos';

	type Member = {
		count: number;
		me?: {
			id: number;
			info: {
				name: string;
			};
		};
		members: {
			id: number;
			name: string;
		}[];
	};

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
	let userTyping: string | null = null;
	let canPublishTimeout: null | NodeJS.Timeout = null;
	const canPublishTimer = 1500;
	let typingTimeout: null | NodeJS.Timeout = null;
	const typingTimer = 3500;

	let messages: Message[] = [];
	let members: Member = {
		count: 0,
		members: []
	};

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
		if (room.isGroup) {
			channelName = `presence-room-${room.id}`;
		} else {
			channelName = `private-room-${room.id}`;
		}

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
		channel?.bind('pusher:subscription_succeeded', function (data) {
			isConnected = true;
			const newMembers = listify(data.members, (key, val) => {
				let g = convertToJson(val);
				return { ...g };
			});

			members = {
				count: data.count,
				members: Array.from(newMembers)
			};
		});

		channel?.bind('pusher:member_added', (data) => {
			members = {
				count: members.count + 1,
				members: [...members.members, { id: data.info.id, name: data.info.name }]
			};
		});

		channel?.bind('pusher:member_removed', (data) => {
			const newMembers = members.members.filter((e) => e.id !== data.info.id);

			members = {
				count: members.count - 1,
				members: newMembers
			};
		});

		channel?.bind('typing', (data) => {
			userTyping = `${data.user.name} is typing...`;

			typingTimeout = setTimeout(() => {
				userTyping = null;

				if (typingTimeout) clearTimeout(typingTimeout);
			}, typingTimer);
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
		pusher?.unsubscribe(channelName);
	}

	// show typing. add a simple implementation of debounce
	let canPublishTyping = true;
	async function handleTyping() {
		if (canPublishTyping) {
			await fetch(`${backendUrl}/room/${room.id}/typing?huhu=jiji`, {
				method: 'GET',
				headers: getBackendHeaders(accessToken)
			});

			canPublishTyping = false;

			canPublishTimeout = setTimeout(() => {
				canPublishTyping = true;

				if (canPublishTimeout) clearTimeout(canPublishTimeout);
			}, canPublishTimer);
		}
	}
</script>

<div class="flex gap-2 lg:gap-4">
	<div class="flex-grow card">
		<div class="relative min-h-[50vh]">
			<div class="flex flex-wrap justify-between gap-4">
				<h4 class="subtitle">
					{room.name}
					<span class="text-xs italic rounded px-2 py-0.5 bg-gray-500 ml-3">Group</span>
				</h4>
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
			<ul class="h-[35vh] mt-4 overflow-auto pr-3" use:scrollToBottomAction>
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
					<MessageInput on:send={sendMessage} on:typing={handleTyping} />
				</div>
			{/if}

			<!-- show typing -->
			{#if userTyping}
				<div
					class="absolute top-[20px] left-0"
					transition:fade={{ duration: 300, easing: quadOut }}
				>
					<span class="italic text-xs text-gray-500 dark:text-gray-400">
						{userTyping}
					</span>
				</div>
			{/if}
		</div>
	</div>
	<div class="min-h-[50vh]">
		<h5>Members: {members.count}</h5>

		{#if members.count > 0}
			<ul class="h-[35vh] mt-4 overflow-auto" use:scrollToBottomAction>
				{#each members.members as member}
					<li class="flex gap-2 text-xs">
						<span class="text-gray-500 dark:text-gray-400">
							{member.id}
						</span>
						<span class="text-gray-700 dark:text-gray-300">
							{member.name}
						</span>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
