<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let name: string;
	export let label = name.substring(0, 1).toUpperCase() + name.substring(1).replaceAll('_', ' ');
	export let placeholder = label;
	export let value = null;
	export let noMb: boolean | undefined = undefined;

	const dispatcher = createEventDispatcher();
	function handleInput(e: CustomEvent<FormEventHandler<HTMLInputElement>>) {
		dispatcher('input', e);
	}
</script>

<div class:mb-4={!noMb}>
	<label for={name} class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
		>{label}</label
	>
	<input
		id={name}
		{name}
		class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
		{placeholder}
		bind:value
		on:input={handleInput}
		{...$$restProps}
	/>
</div>
