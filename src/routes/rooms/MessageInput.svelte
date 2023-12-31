<script lang="ts">
	import { Emoji } from '$lib/components';
	import { createEventDispatcher } from 'svelte';
	import type { EmojiSelection } from '$lib/types';

	export let placeholder = 'Your message';
	export let label = 'Send a message';
	export let name = 'message';

	let model = '';

	const dispatch = createEventDispatcher<{ send: string }>();
	function handleSubmit() {
		dispatch('send', model);
		model = '';
	}

	const dispatchTyping = createEventDispatcher<{ typing: void }>();
	function handleTyping() {
		dispatchTyping('typing');
	}

	const dispatchVideo = createEventDispatcher<{ video: void }>();
	function handleVideo() {
		dispatchVideo('video');
	}

	function onEmoji(event: CustomEvent<EmojiSelection>) {
		model += event.detail.emoji;
	}
</script>

<form on:submit|preventDefault={handleSubmit} autocomplete="off" class="relative">
	<label for={name} class="sr-only">{label}</label>
	<div class="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-600">
		<button
			type="button"
			class="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
		>
			<svg
				aria-hidden="true"
				class="w-6 h-6"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
					clip-rule="evenodd"
				/></svg
			>
			<span class="sr-only">Upload image</span>
		</button>

		<button
			type="button"
			class="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
			on:click={handleVideo}
		>
			<svg
				aria-hidden="true"
				class="w-6 h-6"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path
					d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z"
				/>
				<rect x="3" y="6" width="12" height="12" rx="2" />
				<line x1="7" y1="12" x2="11" y2="12" />
				<line x1="9" y1="10" x2="9" y2="14" />
			</svg>

			<span class="sr-only">Start Video</span>
		</button>

		<Emoji on:select={onEmoji} autoClose={false}>
			<div
				class="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
			>
				<svg
					aria-hidden="true"
					class="w-6 h-6"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
						clip-rule="evenodd"
					/></svg
				>
				<span class="sr-only">Add emoji</span>
			</div>
		</Emoji>

		<input
			id={name}
			class="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
			{placeholder}
			required
			bind:value={model}
			on:input={(e) => handleTyping()}
		/>
		<button
			type="submit"
			class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
		>
			<svg
				aria-hidden="true"
				class="w-6 h-6 rotate-90"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
				/></svg
			>
			<span class="sr-only">{placeholder}</span>
		</button>
	</div>
</form>
