<script lang="ts">
	import { get } from 'svelte/store';
	import { confirmation } from '../../stores';
	import {
		deleteFile,
		deleteFolder,
		deleteFolders,
		refreshItems,
	} from '../../util/files';
	import { selected, unselectItem } from '../../util/selected';

	async function deleteItems() {
		const folders: { name: string; id: number }[] = [];

		for (const item of get(selected)) {
			if (item.type == 'Folder') {
				folders.push({ name: item.name, id: item.id });
			} else {
				await deleteFile(item.id, item.name, get(selected).length > 1);
			}

			unselectItem(item.id, item.type, item.name);
		}

		if (folders.length > 0) {
			if (folders.length > 1) {
				deleteFolders(folders.map(v => v.id));
			} else {
				deleteFolder(folders[0].id, folders[0].name);
			}
		}
		await refreshItems();

		confirmation.set(false);
	}
</script>

<div
	class="w-screen h-screen absolute top-0 left-0 flex justify-center items-end md:items-center"
>
	<div
		class=" border-black/20 bg-neutral-900 border-2 rounded-lg md:max-w-lg md:mx-auto p-8 py-5  inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative"
	>
		<div class="md:flex items-center">
			<div
				class="rounded-full border border-gray-300 flex items-center justify-center  w-20 h-20 flex-shrink-0 mx-auto"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="w-10 h-10"
				>
					<path
						fill-rule="evenodd"
						d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
			<div class="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
				<p class="font-bold text-2xl">Are you sure?</p>
				<p class="text-sm  mt-1">
					By deleting this or these Folder/File you will lose all nested Files
					and Foldes. This process is irreversible and the Folder cannot be
					restored.
				</p>
			</div>
		</div>

		<div class="text-center md:text-right mt-4 md:flex md:justify-end">
			<button
				on:click={deleteItems}
				class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-700 hover:bg-red-500 text-red-100 rounded-lg font-semibold text-sm md:ml-2 md:order-2"
			>
				Delete Items
			</button>
			<button
				on:click={() => {
					confirmation.set(false);
				}}
				class="block hover:bg-neutral-800/10 w-full md:inline-block md:w-auto px-4 py-3 md:py-2  rounded-lg font-semibold text-sm mt-4
          md:mt-0 md:order-1">Cancel</button
			>
		</div>
	</div>
</div>
