<script>
	import { siteInfo } from '$lib/constants';
</script>

<footer class="bg-white rounded-t-lg shadow dark:bg-gray-900 my-4">
	<div class="container">
		<div class="w-full py-4 md:py-8">
			<div class="sm:flex sm:items-center sm:justify-between">
				<a href="/" class="flex items-center mb-4 sm:mb-0">
					<!-- <img src="https://flowbite.com/docs/images/logo.svg" class="h-8 mr-3" alt="Flowbite Logo" /> -->
					<span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
						>{siteInfo.siteName}</span
					>
				</a>
				<ul
					class="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400"
				>
					<li>
						<a href="#" class="mr-4 hover:underline md:mr-6">About</a>
					</li>
					<li>
						<a href="#" class="mr-4 hover:underline md:mr-6">Privacy Policy</a>
					</li>
					<li>
						<a href="#" class="mr-4 hover:underline md:mr-6">Licensing</a>
					</li>
					<li>
						<a href="#" class="hover:underline">Contact</a>
					</li>
				</ul>
			</div>
			<hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
			<span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400"
				>© {new Date().getFullYear()}
				<a href="https://acelords.com/" class="hover:underline">AceLords</a>. All Rights Reserved.</span
			>
		</div>
	</div>
</footer>
