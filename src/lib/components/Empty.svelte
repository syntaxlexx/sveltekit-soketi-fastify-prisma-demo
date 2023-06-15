<script lang="ts">
	export let message = 'No data found';
</script>

<div class="card flex flex-col justify-center items-center">
	<slot>{message}</slot>
</div>
