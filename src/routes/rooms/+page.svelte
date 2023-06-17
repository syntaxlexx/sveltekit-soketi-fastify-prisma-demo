<script lang="ts">
	import { Button, Empty, Icon } from '$lib/components';
	import { openModal } from 'svelte-modals';
	import Modal from './Modal.svelte';
	import type { Room } from '@prisma/client';
	import PresenceRoomMessages from './PresenceRoomMessages.svelte';
	import PublicRoomMessages from './PublicRoomMessages.svelte';
	import { invalidateAll } from '$app/navigation';
	import PrivateRoomMessages from './PrivateRoomMessages.svelte';

	export let data;

	$: rooms = data.rooms;
	$: accessToken = data.accessToken;
	$: user = data.user;

	let selectedRoom: Room | null | undefined = undefined;
	let showPublicRoom = true;

	function createRoom() {
		openModal(Modal);
	}

	function handleSelectedRoom(room: Room) {
		showPublicRoom = false;
		selectedRoom = room;
	}

	function publicRoom() {
		showPublicRoom = true;
		selectedRoom = null;
	}

	async function refreshRooms() {
		await invalidateAll();
	}
</script>

<div class="flex flex-wrap items-center justify-between gap-5">
	<h2 class="title">Rooms</h2>

	<div class="flex flex-wrap gap-1">
		<span>Public Chatroom = <strong>public</strong> channel,</span>
		<span>Groups = <strong>presence</strong> channel,</span>
		<span>Private Rooms = <strong>private</strong> channel</span>
	</div>
</div>

<div class="flex flex-wrap mt-8">
	<div class="w-full lg:w-1/3">
		<div class="mb-4">
			<div class="flex justify-between">
				<h4 class="subtitle">Available Rooms</h4>
				<Icon name="refresh" clickable on:click={refreshRooms} />
			</div>
		</div>

		{#if rooms.length < 1}
			<Empty message="No rooms found" />
		{:else}
			{#each rooms as item, i}
				<div class="room-item" on:click={() => handleSelectedRoom(item)}>
					<div class="flex items-center gap-1">
						<div class="text-gray-500">{i + 1}.</div>
						<div class="text-lg">{item.name}</div>
						{#if item.isGroup}
							<div class="text-xs italic rounded px-2 py-0.5 bg-gray-500 ml-3">Group</div>
						{/if}
					</div>
					<div class="text-gray-400 dark:text-gray-600">
						<div class="icon">
							<Icon name="chevron-right" />
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<div class="w-full lg:w-2/3">
		<div class="lg:ml-8">
			<div class="flex justify-between mb-4">
				<Button icon="add" on:click={createRoom}>Create Room</Button>
				<Button icon="chat" on:click={publicRoom}>Go to Public Chatroom</Button>
			</div>

			<div class="">
				{#if showPublicRoom}
					<PublicRoomMessages {accessToken} {user} />
				{:else if selectedRoom}
					{#if selectedRoom.isGroup}
						<PresenceRoomMessages room={selectedRoom} {accessToken} {user} />
					{:else}
						<PrivateRoomMessages room={selectedRoom} {accessToken} {user} />
					{/if}
				{:else}
					<div class="card">
						<div class="h-[50vh] w-full flex items-center justify-center">
							<p>Select a room to proceed</p>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style lang="css">
	.room-item {
		@apply flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 hover:pl-2 transition-all duration-300;
	}
	.room-item .icon {
		@apply opacity-0 pr-5 transition-all duration-300;
	}
	.room-item:hover .icon {
		@apply opacity-100 pr-2 transition-all duration-500;
	}
</style>
