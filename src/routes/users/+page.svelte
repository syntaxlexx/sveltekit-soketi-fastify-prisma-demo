<script>
	import { Title } from '$lib/components';
	import { onMount } from 'svelte';

	onMount(async () => {
		const resp = await fetch('http://localhost:6001/users');
		const users = await resp.json();
		console.log('users', users);
	});
</script>

<Title>Users</Title>
