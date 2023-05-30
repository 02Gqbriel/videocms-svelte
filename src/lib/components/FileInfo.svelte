<script lang="ts">
	import { tryit } from 'radash';
	import { getFileInfos } from '$lib/util/files';

	export let closeInfo: () => void;
	export let itemId: number;

	let x: number;
	let y: number;

	let clientWidth: number;
	let clientHeight: number;

	type IPointerMoveParameter = PointerEvent & { currentTarget: EventTarget & Window };

	const pointermove = (ev: IPointerMoveParameter) => {
		if (!draggingFileInfo) return;

		ev.preventDefault();

		x = ev.pageX + (ev.currentTarget.screenX - clientWidth);
		y = ev.pageY + (ev.currentTarget.screenY - clientHeight);

		console.log(x, ev.pageX);
	};

	let draggingFileInfo = false;

	type IPointerDownParameter = PointerEvent & { currentTarget: EventTarget & HTMLDivElement };

	const pointerdown = (ev: IPointerDownParameter) => {
		ev.preventDefault();

		if (!draggingFileInfo) draggingFileInfo = true;
	};
</script>

<svelte:window on:pointermove={pointermove} />

<button
	bind:clientWidth
	bind:clientHeight
	on:click|stopPropagation={closeInfo}
	class="absolute mx-2 rounded-lg border-2 border-neutral-800 border-opacity-50 bg-neutral-900/80 backdrop-blur-sm"
	style={`top: ${y}px;left: ${x}px;`}
>
	{#await tryit(getFileInfos)(itemId)}
		<div>loading...</div>
	{:then [err, data]}
		<div on:pointerdown={pointerdown} class="cursor-grab p-2">
			{data?.Name}
		</div>
	{/await}
	<div class="p-2">king 2</div>
</button>
