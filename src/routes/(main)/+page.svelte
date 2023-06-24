<script lang="ts">
	import { getFiles } from '$lib/util/files';
	import type { FolderItem, FileItem } from '$lib/util/files';
	import { createQuery } from '@tanstack/svelte-query';

	import List from './List.svelte';

	import Item from './Item.svelte';
	import { currentFolderId } from '$lib/util/traversing';

	import SortRow from './SortRow.svelte';
	import { confirmation, fileUpload, newFolder } from '$lib/util/stores';
	import { dragging } from '$lib/util/dragndrop';

	let innerHeight: number = 0;

	$: query = createQuery<(FolderItem | FileItem)[], Error>({
		queryKey: ['files', $currentFolderId],
		queryFn: () => getFiles($currentFolderId)
	});
</script>

<svelte:window bind:innerHeight />

<div class="grow">
	<SortRow />

	{#if $confirmation}
		{#await import('./Confirmation.svelte') then { default: Confirmation }}
			<Confirmation />
		{/await}
	{/if}

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
		{#await import('./DragItem.svelte') then { default: DragItem }}
			<DragItem />
		{/await}
	{/if}

	{#if $query.isLoading}
		<div class="flex flex-col gap-6 px-3 py-3.5">
			{#each Array(10) as _}
				{@const width = Math.floor(Math.random() * (200 - 120 + 1) + 140)}

				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="mr-px h-4 w-4 animate-pulse rounded-sm bg-neutral-800" />
						<div class="h-4 w-4 animate-pulse rounded-sm bg-neutral-800" />
						<div style="width: {width}px;" class="h-4 animate-pulse rounded-sm bg-neutral-800" />
					</div>

					<div>
						<div class="h-4 w-[135px] animate-pulse rounded-sm bg-neutral-800" />
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
