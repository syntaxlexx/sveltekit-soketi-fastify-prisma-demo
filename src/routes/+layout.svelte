<script lang="ts">
	import '../app.css';

	import { Modals, closeModal } from 'svelte-modals';
	import { fade } from 'svelte/transition';
	import Footer from './Footer.svelte';
	import Navbar from './Navbar.svelte';
	import { siteInfo } from '$lib/constants';

	export let data;

	$: user = data.user;
</script>

<svelte:head>
	<title>{siteInfo.siteName}</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-800">
	<Navbar auth={user} />

	<div class="container mt-8 min-h-[69vh]">
		<slot />
	</div>

	<Footer />
</div>

<Modals>
	<div slot="backdrop" class="backdrop" transition:fade on:click={closeModal} />
</Modals>
