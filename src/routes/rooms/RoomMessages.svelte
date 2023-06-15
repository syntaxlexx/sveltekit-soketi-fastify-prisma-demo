<script lang="ts">
	import type { Room } from "@prisma/client";

    export let room: Room
</script>

<h4 class="subtitle">{room.name}</h4>
