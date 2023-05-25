<script lang="ts">
	import { getFiles } from '$lib/util/files';
	import type { FolderItem, FileItem } from '$lib/util/files';
	import { createQuery } from '@tanstack/svelte-query';

	import List from './List.svelte';

	import Item from './Item.svelte';
	import { currentFolderId } from '$lib/util/traversing';

	import SortRow from './SortRow.svelte';
	import { fileUpload, newFolder } from '$lib/util/stores';
	import { draggedItem, dragging } from '$lib/util/dragndrop';

	let innerHeight: number = 0;

	$: query = createQuery<(FolderItem | FileItem)[], Error>({
		queryKey: ['files', $currentFolderId],
		queryFn: () => getFiles($currentFolderId)
	});

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

<svelte:window bind:innerHeight on:pointermove={(ev) => ($dragging ? handleMouseMove(ev) : null)} />

<div class="grow">
	<SortRow />

	{#if $newFolder}
		{#await import('./NewFolder.svelte') then { default: NewFolder }}
			<NewFolder />
		{/await}
	{/if}

	{#if $fileUpload}
		{#await import('./FileUpload.svelte') then { default: FileUpload }}
			<FileUpload />
		{/await}
	{/if}

	{#if $dragging}
		<div
			style="left: {mouseX}px; top: {mouseY}px;"
			class="z-50 bg-neutral-900/70 backdrop-blur-sm absolute p-3 rounded-lg pointer-events-none flex flex-col gap-3"
		>
			{#if draggedItem.type == 'File'}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="w-20 h-20 fill-blue-900"
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
					class="w-20 h-20 fill-blue-900"
				>
					<path
						d="M3.75 3A1.75 1.75 0 002 4.75v3.26a3.235 3.235 0 011.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM3.75 9A1.75 1.75 0 002 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-4.5A1.75 1.75 0 0016.25 9H3.75z"
					/>
				</svg>
			{/if}

			<p class="text-xs w-20 truncate ">
				{draggedItem.name}
			</p>
		</div>
	{/if}

	{#if $query.isLoading}
		<div class="flex flex-col gap-6 py-3.5 px-3">
			{#each Array(10) as _}
				{@const width = Math.floor(Math.random() * (200 - 120 + 1) + 140)}

				<div class="flex  justify-between items-center">
					<div class="flex items-center gap-3">
						<div class="w-4 h-4 rounded-sm animate-pulse bg-neutral-800 mr-px" />
						<div class="w-4 h-4 rounded-sm animate-pulse bg-neutral-800" />
						<div style="width: {width}px;" class="h-4 rounded-sm animate-pulse bg-neutral-800" />
					</div>

					<div>
						<div class="w-[135px] h-4 rounded-sm animate-pulse bg-neutral-800" />
					</div>
				</div>
			{/each}
		</div>
	{:else if $query.isSuccess}
		{@const height = innerHeight - ($newFolder ? 166 : 126) + 'px'}

		<List {height} let:item items={$query.data}>
			<Item {item} />
		</List>
	{/if}
</div>
