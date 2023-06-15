<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Icon } from '.';

	const dispatch = createEventDispatcher<{ click: void }>();

	function handleClick() {
		dispatch('click');
	}

	type ButtonColor = 'primary' | 'success' | 'ghost' | 'error';
	type ButtonSize = 'n' | 'sm';

	export let color: ButtonColor = 'primary';
	export let size: ButtonSize = 'n';
	export let title = 'Click me';
	export let loading = false;
	export let icon: string | undefined = undefined;
	export let iconSuffix: string | undefined = undefined;
	export let block: boolean | undefined = undefined;
</script>

<button
	class="flex items-center justify-center gap-2 lg:gap-3 {color} btn-{size}"
	class:w-full={block}
	disabled={loading}
	{...$$restProps}
	on:click={handleClick}
>
	{#if icon}
		<Icon name={icon} />
	{/if}
	<slot>{title}</slot>
	{#if iconSuffix}
		<Icon name={iconSuffix} />
	{/if}
</button>

<style lang="css">
	.primary {
		@apply text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800  text-center;
	}
	.success {
		@apply text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 text-center;
	}
	.error {
		@apply text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 text-center;
	}
	.ghost {
		@apply text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200  dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700;
	}
	.btn-n {
		@apply font-medium rounded-lg text-sm px-5 py-2.5;
	}
	.btn-sm {
		@apply font-medium rounded-lg text-xs px-3 py-1.5;
	}
</style>
