<script lang="ts">
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { Button, DisplayErrors, Icon, Input } from '$lib/components';
	import type { PageData, ActionData } from './$types';
	import type { ActionResult } from '@sveltejs/kit';

	export let data: PageData;
	export let form: ActionData;

	async function handleSubmit(event) {
		const data = new FormData(this);

		const response = await fetch(this.action, {
			method: 'POST',
			body: data
		});

		const result: ActionResult = deserialize(await response.text());

		if (result.type === 'success') {
			// re-run all `load` functions, following the successful update
			await invalidateAll();
		}

		applyAction(result);
	}
</script>

<div class="flex flex-col items-center mt-8">
	<div class="card">
		<div class="flex justify-between items-center">
			<h2 class="title">Login</h2>
			<a href="/register" class="text-xs">
				Register here
				<Icon name="forward" size="sm" />
			</a>
		</div>
		<br />
		<form method="POST" action="?/login" on:submit|preventDefault={handleSubmit}>
			<Input name="email" type="email" required />
			<Input name="password" type="password" required />
			<Button type="submit" iconSuffix="forward" block>Login</Button>
		</form>

		{#if form?.errors}
			<DisplayErrors errors={form?.errors} />
		{/if}
	</div>
</div>
