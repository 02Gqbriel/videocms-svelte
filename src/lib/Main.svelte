<script lang="ts">
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';
	import { get, writable } from 'svelte/store';
	import VirtualList from './VirtualList.svelte';
	import { createFolder, files, refreshItems } from '../util/files';
	import { default as ListItem } from './Item.svelte';
	import { currentFolderID, leaveFolder } from '../util/folderTraversing';
	import { doubletap } from '../util/doubletap';
	import { refreshAuth, token, tokenExp } from '../util/auth';

	let fileUpload = writable<boolean>(false);

	let newFolder = false;
	let ref: HTMLInputElement;
	let setNewFolder = (v: boolean) => (newFolder = v);

	let innerHeight: number;

	onMount(() => {
		if (!Number.isNaN(Number(get(tokenExp)))) {
			setTimeout(refreshAuth, dayjs(Number(get(tokenExp)), 'x').diff() - 5000);
		} else {
			token.set(undefined);
		}
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		const success = await createFolder(ref.value, $currentFolderID);

		if (success) {
			newFolder = false;
			ref.value = '';
		}
	}
</script>

<svelte:window bind:innerHeight />

{#if $fileUpload}
	{#await import('./File.svelte') then { default: File }}
		<svelte:component this={File} {fileUpload} />
	{/await}
{/if}

{#await import('./Header.svelte') then { default: Header }}
	<svelte:component this={Header} {setNewFolder} {fileUpload} />
{/await}

<div class="s">
	{#await refreshItems()}
		<div>
			<div>l</div>
		</div>
	{:then _}
		<div class="text-sm">
			{#if newFolder}
				<form
					on:submit={handleSubmit}
					class=" border-b flex items-center justify-between border-opacity-10 border-gray-600  cursor-pointer hover:bg-neutral-800/50"
				>
					<div class="flex grow items-center  gap-2 ">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="w-5 h-5 fill-blue-700 m-3 mr-0"
						>
							<path
								d="M3.75 3A1.75 1.75 0 002 4.75v3.26a3.235 3.235 0 011.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM3.75 9A1.75 1.75 0 002 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-4.5A1.75 1.75 0 0016.25 9H3.75z"
							/>
						</svg>

						<input
							placeholder="New folder name"
							type="text"
							class="bg-transparent w-full h-full focus:outline-none placeholder:font-light placeholder:text-neutral-700"
							bind:this={ref}
							on:load={() => ref.focus({ preventScroll: true })}
						/>
					</div>

					<div class="flex items-center justify-end mr-2">
						<button
							on:click={() => (newFolder = false)}
							type="button"
							class="m-2 p-1 rounded hover:bg-neutral-800"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								class="w-6 h-6"
							>
								<path
									fill-rule="evenodd"
									d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
									clip-rule="evenodd"
								/>
							</svg>
						</button>

						<button
							type="submit"
							class="m-1.5 md:hidden p-2 rounded hover:bg-neutral-800"
						>
							Submit
						</button>
					</div>
				</form>
			{/if}

			<div
				class=" border-b flex items-center justify-between border-opacity-10 border-gray-600  cursor-pointer hover:bg-neutral-800/50 "
			>
				<button
					title={$currentFolderID == 0
						? 'Already in root folder'
						: 'Return to Parentfolder'}
					disabled={$currentFolderID == 0}
					use:doubletap
					on:doubletap={() => $currentFolderID > 0 && leaveFolder()}
					class="p-3 flex-grow flex items-center gap-2 {$currentFolderID == 0
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

			<VirtualList
				height={innerHeight - (newFolder ? 118 : 70) + 'px'}
				items={$files}
				let:item
			>
				<ListItem {item} />
			</VirtualList>
		</div>
	{/await}
</div>
