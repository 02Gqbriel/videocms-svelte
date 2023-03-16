<script lang="ts">
	import type { Item } from '../util/files';
	import throttle from 'raf-throttle';
	import { draggedItem, targetItem } from '../util/moveFolder';

	export let item: Item;

	let mX;
	let mY;

	const pointermove = throttle(function (ev: PointerEvent) {
		mX = ev.clientX;
		mY = ev.clientY;
	});
</script>

<svelte:window on:pointermove={pointermove} />

<div
	style="left: {mX}px; top: {mY}px"
	class="fixed flex flex-col gap-2 items-center z-50 py-2 px-4 rounded-lg border-neutral-700 border border-opacity-50 cursor-grabbing  -translate-y-full pointer-events-none bg-neutral-800/50 backdrop-blur-sm"
>
	{#if item.Type == 'File'}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			class="w-10 h-10 fill-blue-700"
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
			class="w-10 h-10 fill-blue-700"
		>
			<path
				d="M3.75 3A1.75 1.75 0 002 4.75v3.26a3.235 3.235 0 011.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM3.75 9A1.75 1.75 0 002 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-4.5A1.75 1.75 0 0016.25 9H3.75z"
			/>
		</svg>
	{/if}
	{item.Name}

	{#if targetItem !== undefined}
		<div class="absolute left-0 w-screen bg-black">
			Move {draggedItem.item.Type}
			{draggedItem.item.Name} to {targetItem.item.Type}
			{targetItem.item.Name}
		</div>
	{/if}
</div>
