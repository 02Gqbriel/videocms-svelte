<script lang="ts">
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	import { deleteFile, deleteFolder, updateFolder } from '../util/files';
	import type { Item } from '../util/files';
	import { doubletap } from '../util/doubletap';
	import { enterFolder } from '../util/folderTraversing';
	import { url } from '../stores';

	export let item: Item;

	let rename = false;
	let ref: HTMLInputElement;

	async function handleRename(e: SubmitEvent) {
		e.preventDefault();

		const success = await updateFolder(item.ID, item.ParentFolderID, ref.value);

		if (success) {
			rename = false;
		}
	}

	dayjs.extend(relativeTime);

	function handleDoubleClick(e: CustomEvent) {
		enterFolder(item.ID);
	}
</script>

<div
	on:doubletap={handleDoubleClick}
	use:doubletap
	class="border-b group/item flex items-center justify-between border-opacity-10
	border-gray-600 cursor-pointer hover:bg-neutral-800/50"
>
	<div class="flex items-center  gap-2 p-3">
		{#if item.Type == 'File'}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5 fill-blue-700"
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
				class="w-5 h-5 fill-blue-700"
			>
				<path
					d="M3.75 3A1.75 1.75 0 002 4.75v3.26a3.235 3.235 0 011.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM3.75 9A1.75 1.75 0 002 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-4.5A1.75 1.75 0 0016.25 9H3.75z"
				/>
			</svg>
		{/if}

		<form on:submit={handleRename} class="flex relative items-center gap-2">
			<input
				readonly={!rename}
				value={item.Name}
				bind:this={ref}
				on:input={() => (ref.style.width = ref.value.length + 'ch')}
				style="width: {item.Name.length + 'ch'};"
				class="bg-neutral-900 group-hover/item:bg-neutral-800/0 z-10 active:outline-none focus:outline-none {rename
					? ''
					: 'pointer-events-none'}"
			/>

			{#if item.Type == 'Folder'}
				<button
					type="button"
					on:click={() => {
						rename = true;
						ref.focus();
					}}
					title="Rename {item.Type}"
					class="absolute opacity-0 right-0 group-hover/item:-right-6 pl-2 group-hover/item:opacity-90 transition-all p-1"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="w-4 h-4 l"
					>
						<path
							d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z"
						/>
					</svg>
				</button>
			{/if}
		</form>
	</div>

	<div class="flex items-center justify-between w-96">
		<span
			title="This {item.Type.toLowerCase()} was created {dayjs(
				item.CreatedAt
			).fromNow()}"
		>
			{dayjs(item.CreatedAt).fromNow()}
		</span>

		<div class="flex w-8 justify-end items-center">
			<span class="sm:hidden inline">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="w-5 h-5"
				>
					<path
						d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z"
					/>
				</svg>
			</span>

			<span class="sm:flex hidden gap-3 items-center mr-3">
				{#if item.Type == 'File'}
					<a
						target="_blank"
						rel="noreferrer"
						href="{url}/{item.UUID}"
						title="Preview"
						class="hover:bg-neutral-800 p-1 rounded"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="w-5 h-5"
						>
							<path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
							<path
								fill-rule="evenodd"
								d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
								clip-rule="evenodd"
							/>
						</svg>
					</a>
				{/if}

				<button
					on:click={() =>
						item.Type == 'File' ? deleteFile(item.ID) : deleteFolder(item.ID)}
					title="Delete {item.Type}"
					class="bg-red-500 p-1 rounded flex items-center gap-1 font-semibold px-2 mr-2 hover:bg-red-900/90"
				>
					<span>Delete</span>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="w-5 h-5 "
					>
						<path
							fill-rule="evenodd"
							d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
			</span>
		</div>
	</div>
</div>
