<script lang="ts">
	import { siteInfo } from '$lib/constants';

	export let title: string | undefined;

	$: theTitle = `${title ? title + ' |' : ''}${siteInfo.siteName}`;
</script>

<svelte:head>
	<title>{theTitle}</title>
</svelte:head>
