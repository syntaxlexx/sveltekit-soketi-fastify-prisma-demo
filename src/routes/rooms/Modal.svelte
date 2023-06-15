<script lang="ts">
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Button, DisplayErrors, Input, ModalContainer } from '$lib/components';
	import { closeModal } from 'svelte-modals';
	import type { ActionData } from './$types';
	import type { ActionResult } from '@sveltejs/kit';

	export let form: ActionData;

	// provided by modals
	export let isOpen;

	async function handleSubmit(event) {
		const data = new FormData(this);

		const response = await fetch(this.action, {
			method: 'POST',
			body: data
		});

		const result: ActionResult = deserialize(await response.text());

		if (result.type === 'success') {
			closeModal();
			await invalidateAll();
		}

		applyAction(result);
	}
</script>

<ModalContainer isOpen>
	<svelte:fragment slot="title">Create a New Room</svelte:fragment>
	<form method="POST" action="?/create" on:submit|preventDefault={handleSubmit}>
		<Input name="name" type="text" required />
		<div class="actions">
			<Button type="submit" iconSuffix="forward">Create</Button>
		</div>
	</form>

	{#if form?.errors}
		<DisplayErrors errors={form?.errors} />
	{/if}
</ModalContainer>
