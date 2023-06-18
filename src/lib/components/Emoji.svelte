<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import type { EmojiSelection } from '$lib/types';

	const dispatch = createEventDispatcher<{ select: EmojiSelection }>();

	export let autoClose = true;

	let picker: HTMLElement | undefined;
	let trigger: HTMLElement | undefined;
	let isOpen = false;

	onMount(async () => {
		const { createPopup } = await import('@picmo/popup-picker');
		trigger = document.querySelector('#emojiTrigger');

		picker = createPopup(
			{
				hideOnClickOutside: true,
				hideOnEscape: true,
				showCloseButton: false,
				hideOnEmojiSelect: autoClose
			},
			{
				referenceElement: trigger,
				triggerElement: trigger
			}
		);

		trigger?.addEventListener('click', () => {
			picker?.toggle();
		});

		picker?.addEventListener('emoji:select', (selection: EmojiSelection) => {
			dispatch('select', selection);
		});
	});
</script>

<div id="emojiTrigger">
	<slot />
</div>

<div id="pickerContainer" />
