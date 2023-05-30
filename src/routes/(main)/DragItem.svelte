<script lang="ts">
	import { draggedItem, dragging } from '$lib/util/dragndrop';

	let mouseX: number;
	let mouseY: number;

	const handleMouseMove = (ev: MouseEvent) => {
		const { clientX, clientY } = ev;

		mouseX = clamp(clientX - 52, 5, window.innerWidth - 109);
		mouseY = clamp(clientY - 132, 5, window.innerHeight - 137);
	};

	const clamp = (value: number, min: number, max: number) => {
		return value < min ? min : value > max ? max : value;
	};
</script>

<svelte:window on:pointermove={(ev) => ($dragging ? handleMouseMove(ev) : null)} />

<div
	style="left: {mouseX}px; top: {mouseY}px;"
	class="pointer-events-none absolute z-50 flex flex-col gap-3 rounded-lg border border-neutral-800 bg-neutral-900/70 p-3 backdrop-blur-sm"
>
	{#if draggedItem.type == 'File'}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			class="h-20 w-20 fill-blue-900"
		>
			<path
				d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z"
			/>
		</svg>
	{:else}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			class="h-20 w-20 fill-blue-900"
		>
			<path
				d="M3.75 3A1.75 1.75 0 002 4.75v3.26a3.235 3.235 0 011.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM3.75 9A1.75 1.75 0 002 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-4.5A1.75 1.75 0 0016.25 9H3.75z"
			/>
		</svg>
	{/if}

	<p class="w-20 truncate text-xs">
		{draggedItem.name}
	</p>
</div>
