<script lang="ts">
	import { Button, DisplayErrors, Icon, Seo } from '$lib/components';
	import Input from '$lib/components/Input.svelte';
	import { onMount } from 'svelte';
	import { quadOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import type { PageData, ActionData } from './$types';
	import type { ActionResult } from '@sveltejs/kit';
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let isMounted = false;
	onMount(() => {
		isMounted = true;
	});

	export let data;
	$: images = data.images as { url: string; filekey: string }[];

	export let form: ActionData;
	let loading = false;

	async function handleSubmit() {
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

	async function handleDelete() {
		if (confirm('Are you sure you want to delete it?')) {
			const data = new FormData(this);

			const response = await fetch('?/deleteFile', {
				method: 'POST',
				body: data
			});

			console.log('response', response);

			const result: ActionResult = deserialize(await response.text());

			if (result.type === 'success') {
				// re-run all `load` functions, following the successful update
				await invalidateAll();
			}

			applyAction(result);
		}
	}
</script>

<Seo title="Images with S3" />

{#if isMounted}
	<div in:fade={{ duration: 300, easing: quadOut }}>
		<div class="mt-5">
			<h2 class="title">Image uploads with S3</h2>
			<br />

			{#if form?.success}
				<p class="text-green-500 mb-5 text-lg">{form?.message}</p>
			{/if}

			<div class="flex flex-wrap">
				<div class="w-full lg:w-1/2">
					<div class="card">
						<h4 class="title">Upload a File</h4>
						<br />
						<form on:submit|preventDefault={handleSubmit} action="?/upload">
							<Input
								name="image"
								label="Select Image"
								type="file"
								accept="image/*"
								disabled={loading}
								required
							/>
							<Button {loading} icon="upload">Upload</Button>

							{#if form?.errors}
								<DisplayErrors errors={form?.errors} />
							{/if}
						</form>
					</div>
				</div>
				<div class="w-full lg:w-1/2 mt-5 lg:mt-0">
					<div class="lg:ml-5">
						<h4 class="title">Uploads list ({images.length})</h4>
						<br />
						<div class="flex flex-wrap gap-4">
							{#each images as img}
								<form
									class="relative"
									action="?/deleteFile"
									on:submit|preventDefault={handleDelete}
								>
									<img src={img.url} alt="img" class="w-32 h-auto object-contain" />
									<input type="hidden" value={img.filekey} name="filename" />
									<div class="absolute bottom-0 right-0">
										<div class="text-red-500 cursor-pointer">
											<button type="submit">
												<Icon name="delete" />
											</button>
										</div>
									</div>
								</form>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
