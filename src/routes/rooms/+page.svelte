<script lang="ts">
	import { Button, Empty, Icon } from '$lib/components';
	import { openModal } from 'svelte-modals';
	import Modal from './Modal.svelte';
	import type { Room } from '@prisma/client';
	import RoomMessages from './RoomMessages.svelte';

	export let data;

	$: rooms = data.rooms;

	let selectedRoom: Room | null | undefined = undefined;

	function createRoom() {
		openModal(Modal);
	}

	function handleSelectedRoom(room: Room) {
		selectedRoom = room;
	}
</script>

<h2 class="title">Rooms</h2>

<div class="flex flex-wrap mt-8">
	<div class="w-full lg:w-1/3">
		<div class="flex justify-between mb-4">
			<h4 class="subtitle">Available Rooms</h4>
			<Button icon="add" on:click={createRoom}>Create Room</Button>
		</div>
		{#if rooms.length < 1}
			<Empty message="No rooms found" />
		{:else}
			{#each rooms as item, i}
				<div class="room-item" on:click={() => handleSelectedRoom(item)}>
					<div class="flex items-center gap-1">
						<div class="text-gray-500">{i + 1}.</div>
						<div class="text-lg">{item.name}</div>
					</div>
					<div class="text-gray-400">
						<div class="icon">
							<Icon name="chevron-right" />
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<div class="w-full lg:w-2/3">
		<div class="lg:ml-8 card">
			{#if selectedRoom}
				<RoomMessages room={selectedRoom} />
			{:else}
				<div class="h-[50vh] w-full flex items-center justify-center">
					<p>Select a room to proceed</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="css">
	.room-item {
		@apply flex items-center justify-between border-b border-gray-200 pb-1 cursor-pointer hover:bg-gray-200 hover:pl-2 transition-all duration-300;
	}
	.room-item .icon {
		@apply opacity-0 pr-5 transition-all duration-300;
	}
	.room-item:hover .icon {
		@apply opacity-100 pr-2 transition-all duration-500;
	}
</style>
