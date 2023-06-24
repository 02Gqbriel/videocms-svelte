<script lang="ts">
	import FileInfo from '$lib/components/FileInfo.svelte';
	import { dragend, dragging, dragover, dragstart, type IDragItem } from '$lib/util/dragndrop';
	import { moveFile, type FileItem, type FolderItem } from '$lib/util/files';
	import { isAllSelected, isSelected, selectItem, unselectItem } from '$lib/util/selected';
	import { url } from '$lib/util/stores';
	import { add, currentFolderId } from '$lib/util/traversing';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import dayjs from 'dayjs';

	export let item: FolderItem | FileItem;

	type IHandleClickParameter = MouseEvent & { currentTarget: EventTarget & HTMLButtonElement };

	function handleClick(ev: IHandleClickParameter) {
		if ($dragging) {
			ev.preventDefault();
			ev.stopPropagation();
			ev.stopImmediatePropagation();
			return;
		}

		if (item.Type === 'Folder') {
			add(item.ID, item.Name);
		}
	}

	$: isItemSelected = isSelected(item.ID, item.Type) || $isAllSelected;

	function select(ev: MouseEvent) {
		ev.stopPropagation();

		selectItem(item.ID, item.Type);
		isItemSelected = true;
	}

	function unselect(ev: MouseEvent) {
		ev.stopPropagation();

		unselectItem(item.ID, item.Type);
		isItemSelected = false;
	}

	let isInfoOpen = false;

	const closeInfo = () => {
		isInfoOpen = false;
	};

	const openInfo = (ev: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => {
		ev.preventDefault();
		ev.stopImmediatePropagation();

		if (ev.currentTarget.tagName !== 'div') isInfoOpen = true;
	};

	let dragItem: IDragItem;

	$: dragItem = {
		id: item.ID,
		name: item.Name,
		parentFolderId: item.ParentFolderID,
		type: item.Type
	};

	const queryClient = useQueryClient();

	$: moveFileMutation = createMutation({
		mutationFn: moveFile,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['files', $currentFolderId] });
		}
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<svelte:element
	this={$dragging ? 'span' : item.Type === 'File' ? 'a' : 'button'}
	href={item.Type === 'File' ? url + '/' + item.UUID : undefined}
	target={item.Type === 'File' ? '_blank' : undefined}
	on:click={handleClick}
	style="cursor: {$dragging ? (item.Type == 'Folder' ? 'pointer' : 'not-allowed') : 'pointer'};"
	class="flex h-10 w-full items-center justify-between pl-2 pr-4 text-sm hover:bg-neutral-800/10"
	draggable={true}
	on:dragstart|preventDefault={() => dragstart(dragItem)}
	on:pointerover={() => $dragging && dragover(dragItem)}
	on:pointerup={() => $dragging && dragend($moveFileMutation.mutate)}
>
	<div class="flex h-min items-center gap-2.5">
		<div class="relative ml-1.5 mr-1 flex">
			<input
				type="checkbox"
				class="h-3.5 w-3.5 cursor-pointer rounded-[25%]"
				bind:checked={isItemSelected}
				on:click|stopPropagation={(ev) => (isItemSelected ? unselect : select)(ev)}
			/>

			{#if isItemSelected}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="5"
					stroke="currentColor"
					class="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2.5 -translate-x-1/2 -translate-y-1/2 stroke-blue-200"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
				</svg>
			{/if}
		</div>

		{#if item.Type == 'File'}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="h-5 w-5 fill-blue-900"
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
				class="h-5 w-5 fill-blue-900"
			>
				<path
					d="M3.75 3A1.75 1.75 0 002 4.75v3.26a3.235 3.235 0 011.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM3.75 9A1.75 1.75 0 002 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-4.5A1.75 1.75 0 0016.25 9H3.75z"
				/>
			</svg>
		{/if}

		<span>
			{item.Name}
		</span>
	</div>

	<div class="flex items-center gap-2">
		<p class="w-[120px] text-center text-xs tabular-nums">
			{dayjs(item.UpdatedAt).format('HH:mm - DD/MM/YYYY')}
		</p>

		<button on:click|stopPropagation={openInfo} class="group rounded p-1 hover:bg-neutral-800/20">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="h-5 w-5 fill-neutral-500 transition-all group-hover:scale-[1.15] group-hover:fill-neutral-100"
			>
				<path
					d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
				/>
			</svg>
		</button>
	</div>
</svelte:element>

{#if isInfoOpen}
	<FileInfo {closeInfo} itemId={item.ID} />
{/if}
