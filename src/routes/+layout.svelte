<script>
	import { onMount } from 'svelte';
	import '../app.css';
	import Footer from './Footer.svelte';
	import Navbar from './Navbar.svelte';
	import { PUBLIC_PUSHER_APP_ID, PUBLIC_PORT } from '$env/static/public';

	import Pusher from 'pusher-js';
	let pusher;

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

<div class="min-h-screen bg-gray-50">
	<Navbar />

	<div class="container mt-8">
		<slot />
	</div>

	<Footer />
</div>
