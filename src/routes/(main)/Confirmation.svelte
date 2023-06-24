<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import { deleteFile, deleteMany, type FileItem, type FolderItem } from '$lib/util/files';
	import { selected, unselectAll } from '$lib/util/selected';
	import { confirmation } from '$lib/util/stores';
	import { currentFolderId } from '$lib/util/traversing';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import Item from './Item.svelte';

	const queryClient = useQueryClient();

	$: deleteFileMutation = createMutation({
		mutationFn: deleteFile,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['files', $currentFolderId] });
		}
	});

	$: deleteManyMutation = createMutation({
		mutationFn: deleteMany,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['files', $currentFolderId] });
		}
	});

	const handleDelete = () => {
		const folders: number[] = [];
		const files: number[] = [];

		for (const item of $selected) {
			if (item.type === 'File') {
				files.push(item.id);
			} else {
				folders.push(item.id);
			}
		}

		if (folders.length !== 0)
			if (folders.length > 1) {
				$deleteManyMutation.mutate({ items: folders, type: 'Folder' });
			} else {
				$deleteFileMutation.mutate({ id: folders[0], type: 'Folder' });
			}

		if (files.length !== 0)
			if (files.length > 1) {
				$deleteManyMutation.mutate({ items: files, type: 'File' });
			} else {
				$deleteFileMutation.mutate({ id: files[0], type: 'File' });
			}

		unselectAll();

		confirmation.set(false);
	};

	const handleCancel = () => {
		confirmation.set(false);
	};
</script>

<Modal bind:showModal={$confirmation}>
	<div
		class="relative my-3 flex max-h-[95vh] max-w-xl grow flex-col gap-7 rounded-md border border-neutral-900 bg-neutral-900/10 p-3 backdrop-blur-sm"
	>
		<h1 class="flex items-center justify-between gap-3 text-xl font-medium">
			Are you sure?

			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="absolute right-5 top-3 h-12 w-12"
			>
				<path
					fill-rule="evenodd"
					d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
					clip-rule="evenodd"
				/>
			</svg>
		</h1>

		<p class="opacity-70">
			The selected files are permanently deleted and can not be recovered in hinesight. Do you still
			want to proceed?
		</p>

		<div class="flex gap-3 self-end">
			<button class="rounded px-5 py-1 hover:bg-neutral-800/50" on:click={handleCancel}>
				Cancel
			</button>

			<button
				class="rounded bg-red-800 px-5 py-1 transition-all hover:bg-red-800/70"
				on:click|preventDefault={handleDelete}
			>
				Delete
			</button>
		</div>
	</div>
</Modal>
