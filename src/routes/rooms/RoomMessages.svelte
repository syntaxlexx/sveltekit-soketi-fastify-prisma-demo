<script lang="ts">
	import type { Message, Room } from '@prisma/client';
	import { onDestroy, onMount } from 'svelte';
	import { Button, Icon } from '$lib/components';
	import { initializePusher, type Pusher } from '$lib/pusher-client';

	export let room: Room;

	let channel;
	let message = '';
	let channelName = 'room';
	let eventName = 'new-message';
	let pusher: Pusher | null;
	let isConnected = false;
	let isMounted = false;
	let isListening = false;

	let messages: Message[] = [];

	// if the channel name changes, disconnect previous channel,
	// then reconnect to new channel. reset messages also
	$: {
		if (isListening) {
			messages = [];
			disconnectPusher();
			isListening = false;
		}
		channelName = `room-${room.id}`;

		if (isMounted && !isListening) startListening();
	}

	$: if (isMounted && !isListening) startListening();

	onMount(() => {
		isMounted = true;
	});

	onDestroy(() => {
		disconnectPusher();
	});

	function startListening() {
		isListening = true;
		pusher = initializePusher();

		channel = pusher?.subscribe(channelName);

		channel?.bind(eventName, (message) => {
			console.log('message', message);
		});

		// check if the user is subscribed to the above channel
		channel?.bind('pusher:subscription_succeeded', function (members) {
			console.log('successfully subscribed!');
			isConnected = true;
		});

		pusher?.connection.bind('connected', () => {
			// isConnected = true;
		});

		pusher?.connection.bind('disconnected', () => {
			isConnected = false;
			console.log('disconnected');
		});
	}

	async function sendMessage() {
		let resp = await fetch(`http://localhost:3000/ping`);
		console.log('resp', resp);
	}

	function disconnectPusher() {
		console.log('disconnecting pusher...');
		pusher?.unsubscribe(channelName);
	}
</script>

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

<div>Channel: {channelName}</div>

<form on:submit|preventDefault={sendMessage}>
	<Button type="submit" iconSuffix="send">Send Message</Button>
</form>
