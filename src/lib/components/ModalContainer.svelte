<script lang="ts">
	import { closeModal } from 'svelte-modals';
	import { fade } from 'svelte/transition';
	import { Button } from '.';

	export let isOpen: boolean | undefined;
</script>

{#if isOpen}
	<div role="dialog" class="modal" transition:fade>
		<div class="contents">
			<div class="relative">
				<h2 class="title"><slot name="title" /></h2>
				<div class="body">
					<slot>
						<slot name="content">Default Content</slot>
						<div class="actions">
							<slot name="buttons" />
						</div>
					</slot>
				</div>

				<div class="floating-close-button">
					<Button color="ghost" type="button" on:click={closeModal}>Close</Button>
				</div>
			</div>
		</div>
	</div>
{/if}
