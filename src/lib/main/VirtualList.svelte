<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { get } from 'svelte/store';
	import { contents, dragenter, dragstart, drop } from '../../util/dragndrop';
	import type { Item } from '../../util/files';

	// props
	export let items: Item[];
	export let height = '100%';
	export let itemHeight = undefined;

	// read-only, but visible to consumers via bind:start
	export let start = 0;
	export let end = 0;

	// local state
	let height_map = [];
	let rows: HTMLCollectionOf<HTMLElement>;
	let viewport: HTMLElement;

	let viewport_height = 0;
	let visible: { index: number; data: Item }[];
	let mounted: boolean;

	let top = 0;
	let bottom = 0;
	let average_height: number;

	$: visible = items.slice(start, end).map((data, i) => {
		return { index: i + start, data };
	});

	// whenever `items` changes, invalidate the current heightmap
	$: mounted && refresh(items, viewport_height, itemHeight);

	async function refresh(
		items: Item[],
		viewport_height: number,
		itemHeight: number
	) {
		const { scrollTop } = viewport;

		await tick(); // wait until the DOM is up to date

		let content_height = top - scrollTop;
		let i = start;

		while (content_height < viewport_height && i < items.length) {
			let row = rows[i - start];

			if (!row) {
				end = i + 1;
				await tick(); // render the newly visible row
				row = rows[i - start];
			}

			const row_height = (height_map[i] = itemHeight || row.offsetHeight);
			content_height += row_height;
			i += 1;
		}

		end = i;

		const remaining = items.length - end;
		average_height = (top + content_height) / end;

		bottom = remaining * average_height;
		height_map.length = items.length;
	}

	async function handle_scroll() {
		const { scrollTop } = viewport;

		const old_start = start;

		for (let v = 0; v < rows.length; v += 1) {
			height_map[start + v] = itemHeight || rows[v].offsetHeight;
		}

		let i = 0;
		let y = 0;

		while (i < items.length) {
			const row_height = height_map[i] || average_height;
			if (y + row_height > scrollTop) {
				start = i;
				top = y;

				break;
			}

			y += row_height;
			i += 1;
		}

		while (i < items.length) {
			y += height_map[i] || average_height;
			i += 1;

			if (y > scrollTop + viewport_height) break;
		}

		end = i;

		const remaining = items.length - end;
		average_height = y / end;

		while (i < items.length) height_map[i++] = average_height;
		bottom = remaining * average_height;

		if (start < old_start) {
			await tick();

			let expected_height = 0;
			let actual_height = 0;

			for (let i = start; i < old_start; i += 1) {
				if (rows[i - start]) {
					expected_height += height_map[i];
					actual_height += itemHeight || rows[i - start].offsetHeight;
				}
			}

			const d = actual_height - expected_height;
			viewport.scrollTo(0, scrollTop + d);
		}
	}

	onMount(() => {
		rows = get(contents).getElementsByTagName(
			'svelte-virtual-list-row'
		) as HTMLCollectionOf<HTMLElement>;

		mounted = true;
	});
</script>

<svelte-virtual-list-viewport
	bind:this={viewport}
	bind:offsetHeight={viewport_height}
	on:scroll={handle_scroll}
	style="height: {height};
		position: relative;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		display: block;
		"
>
	<svelte-virtual-list-contents
		bind:this={$contents}
		style="padding-top: {top}px; padding-bottom: {bottom}px; display: block;"
	>
		{#each visible as row (row.index)}
			<svelte-virtual-list-row
				draggable="true"
				on:dragenter={dragenter}
				on:dragover={ev => ev.preventDefault()}
				on:drop={ev => drop(ev, row.data.ID, row.data.Type)}
				on:dragstart={ev => dragstart(ev, row.data)}
				style="display: block; overflow: hidden;"
			>
				<slot item={row.data}>Missing template</slot>
			</svelte-virtual-list-row>
		{/each}
	</svelte-virtual-list-contents>
</svelte-virtual-list-viewport>

<style>
	:global(.active-item) {
		position: relative;
		text-decoration: underline;
	}

	:global(.active-item)::after {
		cursor: grab !important;
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: #262626;
		opacity: 0.2;
		z-index: 0;
	}

	:global(.not-allowed-item) {
		position: relative;
	}

	:global(.not-allowed-item)::after {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: #b91c1c;
		opacity: 0.05;
		z-index: 0;
	}
</style>
