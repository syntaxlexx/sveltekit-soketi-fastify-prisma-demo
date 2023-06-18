<script lang="ts">
	import { Seo } from '$lib/components';
	import StatsTable from '$lib/components/StatsTable.svelte';
	import { dateFormat, fromNow } from '$lib/helpers.js';
	import { onMount } from 'svelte';
	import { quadOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	let isMounted = false;

	export let data;

	$: rooms = data.rooms;
	$: messages = data.messages;
	$: users = data.users;
	$: auth = data.user;

	onMount(() => {
		isMounted = true;
		console.log('messages', messages);
		console.log('users', users);
	});

	function findUser(userId: number) {
		return users.find((e) => e.id == userId);
	}
</script>

<Seo title="Admin" />

{#if isMounted}
	<div in:fade={{ duration: 300, easing: quadOut }}>
		<div class="mt-5">
			<h2 class="title">Admin</h2>
			<br />
			<div class="card">
				<p>#ID: <strong>{auth?.id}</strong></p>
				<div class="grid grid-cols-1 lg:grid-cols-2">
					<p>Name: <strong>{auth?.name}</strong></p>
					<p>Email: <strong>{auth?.email}</strong></p>
					<p>Joined: <strong>{dateFormat(auth?.createdAt)} ~{fromNow(auth?.createdAt)}</strong></p>
					<p>
						Last update: <strong>{dateFormat(auth?.updatedAt)} ~{fromNow(auth?.updatedAt)}</strong>
					</p>
				</div>
			</div>

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
							<div class="rounded-full px-2 py-0.5 bg-gray-500 text-xs">
								{messages.reduce((p, n) => {
									return p + n._count.userId;
								}, 0)}
							</div>
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
