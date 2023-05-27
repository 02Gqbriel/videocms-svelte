<script lang="ts">
	export let closeInfo: () => void;
</script>

<button
	on:click|stopPropagation={closeInfo}
	class="absolute right-0 mx-2 rounded-lg border-2 border-neutral-800 border-opacity-50  bg-neutral-900/80 backdrop-blur-sm"
>
	<div class="p-2">king 2</div>
</button>
