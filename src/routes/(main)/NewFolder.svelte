<script lang="ts">
	import { createFolder, type FolderItem } from '$lib/util/files';
	import { newFolder } from '$lib/util/stores';
	import { currentFolderId } from '$lib/util/traversing';
	import {
		createMutation,
		useQueryClient,
		type CreateMutationResult
	} from '@tanstack/svelte-query';

	let value: string = 'New folder';

	const queryClient = useQueryClient();

	$: createFolderMutation = createMutation({
		mutationFn: createFolder,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['files', $currentFolderId] });
		}
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<form
	on:submit|preventDefault={(ev) => {
		$createFolderMutation.mutate({ name: value, parentFolderID: $currentFolderId });
		$newFolder = false;
	}}
	class="flex w-full items-center justify-between pl-2 pr-4 py-2.5 h-10 text-sm hover:bg-neutral-800/10 border-b border-opacity-10 border-neutral-700 -mr-3"
>
	<input type="submit" hidden />

	<div class="flex items-center gap-2.5">
		<div class="relative ml-1.5 mr-1 flex">
			<input type="checkbox" class="w-4 h-4 rounded-[25%] cursor-pointer" />
		</div>

		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			class="w-5 h-5 fill-blue-900"
		>
			<path
				d="M3.75 3A1.75 1.75 0 002 4.75v3.26a3.235 3.235 0 011.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM3.75 9A1.75 1.75 0 002 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-4.5A1.75 1.75 0 0016.25 9H3.75z"
			/>
		</svg>

		<div class="relative border-b-2 pr-2 h-5 border-blue-900">
			<input
				bind:value
				type="text"
				autofocus={true}
				class="text-sm absolute right-0 bottom-0 left-0 top-0 z-10 bg-transparent p-0 border-none caret-blue-900 border-b-2 fill-blue-900"
			/>

			<span class="opacity-0">{@html value.replaceAll(' ', '&nbsp;')}</span>
		</div>
	</div>

	<div class="flex items-center gap-2">
		<button
			type="submit"
			class="hover:bg-neutral-800 rounded w-6 h-6 flex justify-center items-center"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-4 h-4"
			>
				<path
					fill-rule="evenodd"
					d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>

		<button
			type="button"
			on:click={() => newFolder.set(false)}
			class="hover:bg-neutral-800 rounded w-6 h-6 flex justify-center items-center"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5"
			>
				<path
					d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
				/>
			</svg>
		</button>
	</div>
</form>
