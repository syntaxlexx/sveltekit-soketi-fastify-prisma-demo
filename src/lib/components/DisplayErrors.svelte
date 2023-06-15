<script lang="ts">
	import { getValidationErrorMessages } from '$lib/helpers';
	import { Alert } from '.';

	export let errors: string[] | string | null | undefined;

	$: formatedErrors = getValidationErrorMessages(errors);
</script>

{#if errors}
	<div class="my-5">
		<Alert type="error">
			{#each formatedErrors as err}
				<div>{err}</div>
			{/each}
		</Alert>
	</div>
{/if}
