<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ click: void }>();

	function handleClick() {
		dispatch('click');
	}

	type IconSize = 'sm' | 'n' | 'lg' | 'xl';

	export let name = 'edit';
	export let size: IconSize = 'n';
	export let loading: boolean | undefined = undefined;
	let computedIcon: string = name;

	$: {
		let icon = name;

		switch (name) {
			case 'add':
				icon = 'mdi-plus';
				break;
			case 'forward':
				icon = 'arrow-right';
				break;
			case 'back':
				icon = 'arrow-left';
				break;
			case 'logout':
				icon = 'logout';
				break;
			default:
				break;
		}
		computedIcon = icon.startsWith('mdi-') ? icon : `mdi-${icon}`;
	}
</script>

<i class="mdi {computedIcon} icon-{size}" class:mdi-spin={loading} on:click={handleClick} />

<style lang="css">
	.icon-sm {
		@apply text-[14px];
	}
	.icon-n {
		@apply text-[18px];
	}
</style>
