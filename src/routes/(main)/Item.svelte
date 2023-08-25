<script lang="ts">
	import FileInfo from '$lib/components/FileInfo.svelte';
	import { login } from '$lib/util/auth';
	import { dragend, dragging, dragover, dragstart, type IDragItem } from '$lib/util/dragndrop';
	import { pushFileInfo } from '$lib/util/fileinfostack';
	import { moveFile, type FileItem, type FolderItem, getFileInfos } from '$lib/util/files';
	import { isAllSelected, isSelected, selectItem, unselectItem } from '$lib/util/selected';
	import { url } from '$lib/util/stores';
	import { add, currentFolderId } from '$lib/util/traversing';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import dayjs from 'dayjs';
	import { tick } from 'svelte';
	import { flip } from 'svelte/animate';
	import { blur } from 'svelte/transition';

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

	let isSettingsOpen = false;
	let ref: HTMLDivElement;

	let isInfoOpen = false;

	const openInfo = (ev: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) => {
		ev.preventDefault();
		ev.stopImmediatePropagation();

		pushFileInfo({ id: item.ID, title: item.Name, minimzed: false, loading: true });

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
	class="flex h-10 w-full items-center justify-between overflow-visible pl-2 pr-4 text-sm hover:bg-neutral-800/10"
	draggable={true}
	on:dragstart|preventDefault={() => dragstart(dragItem)}
	on:pointerover={() => $dragging && dragover(dragItem)}
	on:pointerup={() => $dragging && dragend($moveFileMutation.mutate)}
>
	<div class="flex h-min items-center gap-2.5">
		<div class="relative ml-1.5 mr-1 flex">
			<input
				aria-label="Select Item"
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

	<div class="relative flex items-center gap-2">
		<p class="w-[120px] text-center text-xs tabular-nums">
			{dayjs(item.UpdatedAt).format('HH:mm - DD/MM/YYYY')}
		</p>

		<button
			disabled={item.Type === 'Folder'}
			on:click|stopPropagation={async (ev) => {
				ev.preventDefault();
				ev.stopImmediatePropagation();

				isSettingsOpen = true;

				await tick();
				ref.focus();
			}}
			aria-label="Name"
			class="group rounded p-1 hover:bg-neutral-800/20 {item.Type === 'Folder'
				? 'pointer-events-none invisible'
				: ''}"
		>
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

{#if isSettingsOpen}
	<div
		in:blur={{ duration: 200 }}
		bind:this={ref}
		tabindex="-1"
		on:blur={async (ev) => {
			ref.focus();

			setTimeout(() => {
				isSettingsOpen = false;
			}, 100);
		}}
		class="fixed right-0 z-50 mr-5 flex flex-col gap-2 rounded-md border-neutral-800 border-opacity-50 bg-neutral-900/50 p-2 backdrop-blur focus:border-2"
	>
		<div class="flex flex-col gap-1">
			<button class="flex items-center gap-2 rounded-lg p-2 py-1 hover:bg-neutral-700/50">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="h-4 w-4"
				>
					<path
						fill-rule="evenodd"
						d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
						clip-rule="evenodd"
					/>
					<path
						fill-rule="evenodd"
						d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
						clip-rule="evenodd"
					/>
				</svg>

				<span class="text-sm"> Open in new tab </span>
			</button>

			<button class="flex items-center gap-2 rounded-lg p-2 py-1 hover:bg-neutral-700/50">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="h-4 w-4"
				>
					<path
						d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z"
					/>
					<path
						d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z"
					/>
				</svg>

				<span class="text-sm"> Copy link </span>
			</button>

			<button
				on:click={openInfo}
				class="flex items-center gap-2 rounded-lg p-2 py-1 hover:bg-neutral-700/50"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="h-4 w-4"
				>
					<path
						fill-rule="evenodd"
						d="M19 5.5a4.5 4.5 0 01-4.791 4.49c-.873-.055-1.808.128-2.368.8l-6.024 7.23a2.724 2.724 0 11-3.837-3.837L9.21 8.16c.672-.56.855-1.495.8-2.368a4.5 4.5 0 015.873-4.575c.324.105.39.51.15.752L13.34 4.66a.455.455 0 00-.11.494 3.01 3.01 0 001.617 1.617c.17.07.363.02.493-.111l2.692-2.692c.241-.241.647-.174.752.15.14.435.216.9.216 1.382zM4 17a1 1 0 100-2 1 1 0 000 2z"
						clip-rule="evenodd"
					/>
				</svg>

				<span class="text-sm"> Properties </span>
			</button>
		</div>

		<hr class="h-px w-full border-neutral-700/50" />

		<div class="flex items-center">
			<button
				title="Rename"
				class="rounded-lg p-1.5 hover:bg-neutral-700/50"
				on:click={(ev) => {
					ev.preventDefault();
					ev.stopImmediatePropagation();

					console.log('nice');
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="h-4 w-4"
				>
					<path
						d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z"
					/>
					<path
						d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z"
					/>
				</svg>
			</button>

			<button
				title="Delete"
				class="rounded-lg p-1.5 hover:bg-neutral-700/50"
				on:click={(ev) => {
					ev.preventDefault();
					ev.stopImmediatePropagation();

					console.log('nice');
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="h-4 w-4"
				>
					<path
						fill-rule="evenodd"
						d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>
	</div>
{/if}
