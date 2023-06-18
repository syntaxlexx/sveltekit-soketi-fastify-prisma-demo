<script lang="ts">
	import StatsTable from '$lib/components/StatsTable.svelte';
	import { onMount } from 'svelte';
	import { quadOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	let isMounted = false;

	export let data;

	$: rooms = data.rooms;
	$: messages = data.messages;
	$: users = data.users;

	onMount(() => {
		isMounted = true;
		console.log('messages', messages);
		console.log('users', users);
	});

	function findUser(userId: number) {
		return users.find((e) => e.id == userId);
	}
</script>

{#if isMounted}
	<div in:fade={{ duration: 300, easing: quadOut }}>
		<div class="mt-5">
			<h2 class="title">Admin</h2>

			<div class="mt-5 flex flex-wrap">
				<div class="w-full lg:w-1/2">
					<div class="card">
						<div class="flex items-center justify-between">
							<h4 class="subtitle">Rooms</h4>
							<div class="rounded-full px-2 py-0.5 bg-gray-500 text-xs">{rooms.length}</div>
						</div>
						<br />
						<StatsTable headers={['Name', 'Users', 'Messages']}>
							{#each rooms as item}
								<tr class="">
									<td class="px-4 py-2">{item.name}</td>
									<td class="px-4 py-2">{item._count.roomUsers}</td>
									<td class="px-4 py-2">{item._count.messages}</td>
								</tr>
							{/each}
						</StatsTable>
					</div>
				</div>

				<div class="w-full lg:w-1/2">
					<div class="lg:ml-5 mt-5 lg:mt-0 card">
						<div class="flex items-center justify-between">
							<h4 class="subtitle">Top 5 Active Users by Messaging</h4>
							<div class="rounded-full px-2 py-0.5 bg-gray-500 text-xs">{rooms.length}</div>
						</div>
						<br />
						<StatsTable headers={['Name', 'Messages']}>
							{#each messages as item}
								<tr class="">
									<td class="px-4 py-2">{findUser(item.userId)?.name}</td>
									<td class="px-4 py-2">{item._count.userId}</td>
								</tr>
							{/each}
						</StatsTable>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
