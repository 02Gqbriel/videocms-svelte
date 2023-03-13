<script lang="ts">
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';
	import { get, writable } from 'svelte/store';
	import VirtualList from './VirtualList.svelte';
	import { files, refreshItems } from '../util/files';
	import { default as ListItem } from './Item.svelte';
	import { currentFolderID, leaveFolder } from '../util/folderTraversing';
	import { refreshAuth, token, tokenExp } from '../util/auth';
	import localforage from 'localforage';
	import { selected, selectItem, unselectItem } from '../util/selected';

	localforage.config({
		name: 'video-cms',
		driver: [localforage.INDEXEDDB, localforage.WEBSQL],
	});

	let fileUpload = writable<boolean>(false);
	let newFolder = writable<boolean>(false);

	let innerHeight: number;

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
	{#await import('./File.svelte') then { default: File }}
		<svelte:component this={File} {fileUpload} />
	{/await}
{/if}

{#await import('./Header.svelte') then { default: Header }}
	<svelte:component this={Header} {newFolder} {fileUpload} />
{/await}

<div class="s">
	<div class="text-sm">
		{#if $newFolder}
			{#await import('./newFolder.svelte') then { default: newFolderComponent }}
				<svelte:component this={newFolderComponent} {newFolder} />
			{/await}
		{/if}

		<div
			class="h-[50px] overflow-hidden border-b flex items-center justify-between border-opacity-10 border-gray-600  cursor-pointer  "
		>
			<div
				title="Select all"
				class="px-3 h-full flex items-center border-r border-opacity-10 border-gray-800 hover:bg-neutral-800/50"
			>
				{#if $selected.length === $files.length && $files.length > 0}
					<button
						on:click={e => {
							e.preventDefault();

							for (const file of get(files)) {
								unselectItem(file.ID, file.Type);
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
								selectItem(file.ID, file.Type);
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
				title={$currentFolderID == 0
					? 'Already in root folder'
					: 'Return to Parentfolder'}
				disabled={$currentFolderID == 0}
				on:click={() => $currentFolderID > 0 && leaveFolder()}
				class=" p-3 h-full  flex-grow flex items-center hover:bg-neutral-800/50 gap-2 {$currentFolderID ==
				0
					? 'opacity-40 cursor-not-allowed'
					: ''}"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
					class="w-5 h-5 fill-blue-500"
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
		{#await refreshItems()}
			<div>
				{#each [0, 0, 0, 0] as _}
					<div
						class="h-[50px] border-b border-opacity-10 border-gray-600 w-full flex items-center justify-between"
					>
						<div class="flex items-center">
							<div
								class="h-[20px] m-3 aspect-square animate-pulse bg-neutral-800 w-min rounded"
							>
								{' '}
							</div>
							<div
								class="h-[20px] m-2 aspect-square animate-pulse bg-neutral-800 w-min rounded"
							>
								{' '}
							</div>

							<div
								class="h-[24px] m-2.5 w-[200px] animate-pulse bg-neutral-800 rounded"
							>
								{' '}
							</div>
						</div>

						<div
							class="h-[24px] m-2.5 w-[200px] animate-pulse bg-neutral-800 rounded"
						>
							{' '}
						</div>
					</div>
				{/each}
			</div>
		{:then}
			<VirtualList
				height={innerHeight - (newFolder ? 118 : 70) + 'px'}
				items={$files}
				let:item
			>
				<ListItem {item} />
			</VirtualList>
		{/await}
	</div>
</div>
