<script lang="ts">
	import { Icon } from '$lib/components';
	import { fromNow } from '$lib/helpers';
	import { onMount } from 'svelte';
	import { quadOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	let isMounted = false;

	export let data;

	$: users = data.users;

	onMount(() => {
		isMounted = true;
	});

	const headers = ['ID', 'Name', 'Email', 'Joined', 'Messages Sent ', 'Actions'];
</script>

<h2 class="title">Users</h2>

{#if isMounted}
	<div in:fade={{ duration: 300, easing: quadOut }}>
		<div class="relative overflow-x-auto mt-5">
			<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<thead
					class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
				>
					<tr>
						{#each headers as item}
							<th scope="col" class="px-6 py-3"> {item} </th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each users as item}
						<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
							<td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
								{item.id}
							</td>
							<td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
								{item.name}
							</td>
							<td class="px-6 py-4">
								{item.email}
							</td>
							<td class="px-6 py-4"> {fromNow(item.createdAt)} </td>
							<td class="px-6 py-4 text-right"> {item._count.messages} </td>
							<td class="px-6 py-4 text-center">
								<Icon name="delete" />
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}
