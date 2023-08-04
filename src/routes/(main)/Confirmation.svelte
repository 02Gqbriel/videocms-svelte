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

	let files = $selected.filter((v) => v.type === 'File');
	let folders = $selected.filter((v) => v.type === 'Folder');

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
		class="relative flex max-h-[95vh] max-w-xl grow gap-7 rounded-md border border-neutral-900 bg-neutral-900/10 px-6 py-3 pt-5 backdrop-blur-sm"
	>
		<span class="h-min rounded-full bg-red-500">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
				class="m-2 h-16 w-16 fill-neutral-900"
			>
				<path
					fill-rule="evenodd"
					d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
					clip-rule="evenodd"
				/>
			</svg>
		</span>

		<div class="flex grow flex-col gap-6">
			<h1 class="text-2xl font-semibold">Delete files for ever?</h1>

			<div class="flex flex-col gap-4">
				<p>You are about to delete the following:</p>

				<p class="border-l-2 border-red-500 pl-2 font-light italic">
					{#if files.length > 0}
						{files.length}

						{' '}

						{#if files.length > 1}
							files
						{:else}
							file
						{/if}

						{' '}

						{#if folders.length > 0}
							and

							{' '}
						{/if}
					{/if}

					{#if folders.length > 0}
						{folders.length}

						{' '}

						{#if folders.length > 1}
							folders
						{:else}
							folder
						{/if}
					{/if}
				</p>

				<p>This action is irreversible. <br /> Are you sure you want to proceed?</p>
			</div>

			<div class="flex gap-2 self-end">
				<button on:click={handleCancel} class="rounded-md px-10 py-1.5 text-sm hover:bg-neutral-800"
					>Cancel</button
				>

				<button on:click={handleDelete} class="rounded-md bg-red-700 px-10 py-1.5 text-sm"
					>Delete</button
				>
			</div>
		</div>
	</div>
</Modal>
