<script lang="ts">
	export let headers: string[];
</script>

<div class="relative overflow-x-auto">
	<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
		<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
			<slot name="header">
				<tr>
					{#each headers as item}
						<th scope="col" class="px-4 py-2"> {item} </th>
					{/each}
				</tr>
			</slot>
		</thead>
		<tbody>
			<slot>content</slot>
		</tbody>
	</table>
</div>
