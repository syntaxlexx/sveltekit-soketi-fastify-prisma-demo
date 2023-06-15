<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { Button } from '$lib/components';
	import { siteInfo } from '$lib/constants';

	type NavItem = {
		title: string;
		route: string;
	};

	const navItems: NavItem[] = [
		{
			title: 'Home',
			route: '/'
		},
		{
			title: 'Rooms',
			route: '/rooms'
		},
		{
			title: 'Users',
			route: '/users'
		},
		{
			title: 'Admin Dashboard',
			route: '/admin'
		}
	];

	export let auth;
</script>

<nav class="bg-white border-gray-200 dark:bg-gray-900">
	<div class="container">
		<div class="flex flex-wrap items-center justify-between py-4">
			<a href="/" class="flex items-center">
				<!-- <img src="/images/logo.svg" class="h-8 mr-3" alt="Flowbite Logo" /> -->
				<span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
					>{siteInfo.siteName}</span
				>
			</a>
			<button
				data-collapse-toggle="navbar-default"
				type="button"
				class="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
				aria-controls="navbar-default"
				aria-expanded="false"
			>
				<span class="sr-only">Open main menu</span>
				<svg
					class="w-6 h-6"
					aria-hidden="true"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
						clip-rule="evenodd"
					/></svg
				>
			</button>
			<div class="hidden w-full md:block md:w-auto" id="navbar-default">
				<ul
					class="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
				>
					{#each navItems as item}
						<li>
							<a
								href={item.route}
								class="nav-link"
								class:active={$page.url.pathname == item.route}
								aria-current="page">{item.title}</a
							>
						</li>
					{/each}

					{#if auth}
						<li>
							<form action="/login?/logout" method="POST" use:enhance>
								<Button type="submit" size="sm" iconSuffix="logout">Logout</Button>
							</form>
						</li>
					{:else}
						<li>
							<a href="/login" class="nav-link">Login</a>
						</li>
					{/if}
				</ul>
			</div>
		</div>
	</div>
</nav>

<style lang="css">
	.nav-link {
		@apply block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent;
	}
	.nav-link.active {
		@apply block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500;
	}
</style>
