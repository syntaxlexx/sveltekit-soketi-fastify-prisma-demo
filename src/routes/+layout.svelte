<script>
	import '../app.css';

	import { onMount } from 'svelte';
	import { Modals, closeModal } from 'svelte-modals';
	import { fade } from 'svelte/transition';
	import Footer from './Footer.svelte';
	import Navbar from './Navbar.svelte';
	import { PUBLIC_PUSHER_APP_ID, PUBLIC_PORT } from '$env/static/public';

	import Pusher from 'pusher-js';
	import { siteInfo } from '$lib/constants';
	let pusher;

	export let data;

	onMount(() => {
		// pusher = new Pusher(PUBLIC_PUSHER_APP_ID, {
		// 	wsHost: '127.0.0.1',
		// 	cluster: 'any',
		// 	wsPort: Number(PUBLIC_PORT),
		// 	forceTLS: false,
		// 	encrypted: true,
		// 	disableStats: true,
		// 	enabledTransports: ['ws', 'wss']
		// });
	});
</script>

<svelte:head>
	<title>{siteInfo.siteName}</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<Navbar auth={data.user} />

	<div class="container mt-8">
		<slot />
	</div>

	<Footer />
</div>

<Modals>
	<div slot="backdrop" class="backdrop" transition:fade on:click={closeModal} />
</Modals>
