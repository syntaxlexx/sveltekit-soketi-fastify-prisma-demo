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
		<div class="flex items-center mb-2">
			<input
				id="is_group"
				type="checkbox"
				name="is_group"
				class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
			/>
			<label for="is_group" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
				>Is Group?</label
			>
		</div>
		<div class="actions">
			<Button type="submit" iconSuffix="forward">Create</Button>
		</div>
	</form>

	{#if form?.errors}
		<DisplayErrors errors={form?.errors} />
	{/if}
</ModalContainer>
