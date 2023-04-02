<script lang="ts">
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import VirtualList from './VirtualList.svelte';
	import { files, filesLoaded, getFile, refreshItems } from '../../util/files';
	import { default as ListItem } from './Item.svelte';
	import {
		currentFolderID,
		leaveFolder,
		prevFolder,
	} from '../../util/folderTraversing';
	import { refreshAuth, token, tokenExp } from '../../util/auth';
	import { selected, selectItem, unselectItem } from '../../util/selected';
	import { confirmation, fileUpload, newFolder } from '../../stores';
	import HeaderSkeleton from '../HeaderSkeleton.svelte';
	import ListSkeleton from './ListSkeleton.svelte';
	import { drop } from '../../util/dragndrop';
	import { currentFileInfo, isFileInfoOpen } from '../../util/moreInfo';

	let innerHeight: number;

	refreshItems();

	onMount(() => {
		if (!Number.isNaN(Number(get(tokenExp)))) {
			setTimeout(refreshAuth, dayjs(Number(get(tokenExp)), 'x').diff() - 5000);
		} else {
			token.set(undefined);
		}
	});
</script>

<svelte:window bind:innerHeight />

{#if $fileUpload}
	{#await import('../uploadFile/File.svelte') then { default: File }}
		<svelte:component this={File} />
	{/await}
{/if}

{#if $confirmation}
	{#await import('./Confirmation.svelte') then { default: Confirmation }}
		<svelte:component this={Confirmation} />
	{/await}
{/if}

{#await import('../Header.svelte')}
	<HeaderSkeleton />
{:then { default: Header }}
	<svelte:component this={Header} />
{/await}

<div class="text-xs sm:text-sm">
	<div
		class="h-[50px] overflow-hidden border-b flex items-center justify-between border-opacity-10 border-gray-600  cursor-pointer  hover:bg-neutral-800/50"
	>
		<div title="Select all" class="pl-3 pr-2.5 h-full flex items-center">
			{#if $selected.length === $files.length && $files.length > 0}
				<button
					on:click={e => {
						e.preventDefault();

						for (const file of get(files)) {
							unselectItem(file.ID, file.Type, file.Name);
						}
					}}
				>
					<svg
						class="fill-neutral-700 hover:fill-neutral-600 active:fill-neutral-300"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="#000000"
						width="24"
						height="24"
					>
						<path
							d="M7 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7zm4 10.414-2.707-2.707 1.414-1.414L11 12.586l3.793-3.793 1.414 1.414L11 15.414z"
						/>
					</svg>
				</button>
			{:else}
				<button
					disabled={$files.length == 0}
					class="disabled:cursor-not-allowed"
					on:click={e => {
						e.preventDefault();

						for (const file of get(files)) {
							selectItem(file.ID, file.Type, file.Name);
						}
					}}
				>
					<svg
						class="fill-neutral-700 hover:fill-neutral-600 active:fill-neutral-300"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="#000000"
						width="24"
						height="24"
					>
						<path
							d="M7 5c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2H7zm0 12V7h10l.002 10H7z"
						/>
					</svg>
				</button>
			{/if}
		</div>
		<button
			id="return"
			title={$currentFolderID == 0
				? 'Already in root folder'
				: 'Return to Parentfolder'}
			disabled={$currentFolderID == 0}
			on:drop={ev => drop(ev, prevFolder() ?? -1, 'Folder')}
			on:dragover={ev => !ev.currentTarget.disabled && ev.preventDefault()}
			on:click={() => $currentFolderID > 0 && leaveFolder() && selected.set([])}
			class=" py-3 h-full  flex-grow flex items-center gap-2 {$currentFolderID ==
			0
				? 'opacity-40 cursor-not-allowed'
				: ''}"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="w-[1.1rem] h-[1.1rem] ml-0.5 fill-blue-500"
			>
				<path
					fill-rule="evenodd"
					d="M9.53 2.47a.75.75 0 010 1.06L4.81 8.25H15a6.75 6.75 0 010 13.5h-3a.75.75 0 010-1.5h3a5.25 5.25 0 100-10.5H4.81l4.72 4.72a.75.75 0 11-1.06 1.06l-6-6a.75.75 0 010-1.06l6-6a.75.75 0 011.06 0z"
					clip-rule="evenodd"
				/>
			</svg>

			<span class=" font-black text-xs">. . /</span>
		</button>
	</div>

	{#if $newFolder}
		{#await import('./NewFolder.svelte') then { default: newFolderComponent }}
			<svelte:component this={newFolderComponent} />
		{/await}
	{/if}

	{#if $filesLoaded}
		<div class="flex w-screen">
			<div class="flex-grow w-min">
				<VirtualList
					height={innerHeight - ($newFolder ? 168 : 117) + 'px'}
					items={$files}
					let:item
				>
					<ListItem {item} />
				</VirtualList>
			</div>

			{#if $isFileInfoOpen}
				{#await import('../moreInfo/MoreInfo.svelte') then { default: MoreInfo }}
					{#await getFile($currentFileInfo) then data}
						<svelte:component this={MoreInfo} fileInfo={data} />
					{/await}
				{/await}
			{/if}
		</div>
	{:else}
		<ListSkeleton />
	{/if}
</div>
