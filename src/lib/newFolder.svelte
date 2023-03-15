<script lang="ts">
	import { newFolder } from '../stores';
	import { createFolder } from '../util/files';
	import { currentFolderID } from '../util/folderTraversing';

	let ref: HTMLInputElement;

	$: newFolder && ref && ref.focus();

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		const success = await createFolder(ref.value, $currentFolderID);

		if (success) {
			newFolder.set(false);
			ref = undefined;
		}
	}
</script>

<form
	on:submit={handleSubmit}
	class=" border-b flex items-center pl-9 justify-between border-opacity-10 border-gray-600  cursor-pointer hover:bg-neutral-800/50"
>
	<div class="flex grow items-center justify-center gap-2 ">
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
			class="bg-transparent w-full h-12 grow focus:outline-none placeholder:font-light placeholder:text-neutral-700"
			bind:this={ref}
		/>
	</div>

	<div class="flex items-center justify-end mr-2">
		<button
			on:click={() => newFolder.set(false)}
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

		<button type="submit" class="m-1.5 md:hidden p-2 rounded hover:bg-neutral-800">
			Submit
		</button>
	</div>
</form>
