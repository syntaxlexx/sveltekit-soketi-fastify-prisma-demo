<script lang="ts">
	import Marquee from 'svelte-fast-marquee';

	let email: string | null = null;

	function handleSubmit() {
		const to = 'info@acelords.com';
		const subject = 'I would love to have a conversation about my project';
		const body = 'Contact phone: ';

		window.open(`mailto:${to}?subject=${subject}&body=${body}&from=${email}`);
	}

	const technologies = [
		'Sveltekit',
		'Docker',
		'Soketi',
		'Pusher SDK',
		'Fastify',
		'TailwindCSS',
		'Prisma',
		'jsonwebtokens',
		'dayjs',
		'zod',
		'typescript',
		'pnpm'
	];
</script>

<section class="relative">
	<div class="container py-8 px-4 text-center lg:py-16 z-10 relative">
		<a
			href="https://laravelte.acelords.com/"
			class="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800"
		>
			<span class="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 mr-3">New</span>
			<span class="text-sm font-medium"
				>Laravelte (Laravel 10 + Svelte + Inertia) was launched! See what's new</span
			>
			<svg
				aria-hidden="true"
				class="ml-2 w-5 h-5"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				><path
					fill-rule="evenodd"
					d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
					clip-rule="evenodd"
				/></svg
			>
		</a>
		<h1
			class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
		>
			Sveltekit, Soketi (w/ Pusher SDK), and Fastify
		</h1>
		<p
			class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-36 dark:text-gray-200"
		>
			... met and fell in love! This is a demo repo to showcase how one would go about building a
			chat-app using realtime websockets. It uses a <strong>Pub/Sub</strong>
			approach as an alternative to the common <strong>Bi-directional</strong> approach provided by
			<a href="socket.io">Socket.io</a>
		</p>
		<form class="w-full max-w-md mx-auto" on:submit|preventDefault={handleSubmit}>
			<label
				for="default-email"
				class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Email sign-up</label
			>
			<div class="relative">
				<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
					<svg
						class="w-5 h-5 text-gray-500 dark:text-gray-400"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
						<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
					</svg>
				</div>
				<input
					type="email"
					id="contact-email"
					class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder="Hire us for your next project. "
					required
					bind:value={email}
				/>
				<button
					type="submit"
					class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
					>Get in Touch</button
				>
			</div>
		</form>
		<div class="italic text-sm text-gray-500 dark:text-gray-400 mt-1">
			* This is <strong>not</strong> a Newsletter
		</div>

		<div class="mt-5">
			<h4 class="mb-2 text-gray-500 dark:text-gray-400">- Technologies -</h4>
			<Marquee speed={20}>
				{#each technologies as item}
					<div
						class="rounded bg-gray-200 dark:bg-gray-700 border-gray-400 dark:border-gray-500 px-3 py-1 text-sm mr-2"
					>
						{item}
					</div>
				{/each}
			</Marquee>
		</div>
	</div>

	<div
		class="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"
	/>
</section>
