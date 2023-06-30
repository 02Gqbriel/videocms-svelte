<script lang="ts">
	import { fileUpload } from '$lib/util/stores';
	import Modal from '$lib/components/Modal.svelte';
	import { add, files } from '$lib/util/thumbnail';
	import { useQueryClient, createMutation } from '@tanstack/svelte-query';
	import { createFile } from '$lib/util/files';
	import { get } from 'svelte/store';
	import { currentFolderId } from '$lib/util/traversing';

	const queryClient = useQueryClient();

	$: createFileMutation = createMutation({
		mutationFn: createFile,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['files', $currentFolderId] });
		}
	});

	let input: HTMLInputElement;
	let loading = false;

	type InputEvent = Event & { currentTarget: EventTarget & HTMLInputElement };

	const handleInput = async (ev: InputEvent) => {
		const inputFiles: File[] = [...(ev.currentTarget.files ?? [])];

		for (const file of inputFiles) {
			add(file);
		}
	};

	const uploadFiles = async (ev: SubmitEvent) => {
		fileUpload.set(false);

		try {
			for (const file of $files) {
				await $createFileMutation.mutateAsync({ file: file.file });
			}
		} catch (ex) {
			console.log(ex);
		} finally {
			files.set([]);
		}
	};

	const removeFile = async (hash: string) => {
		files.set(get(files).filter((v) => v.hash !== hash));
	};
</script>

<Modal bind:showModal={$fileUpload}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<form
		on:click|stopPropagation={() => input.click()}
		on:submit|preventDefault={uploadFiles}
		class="relative my-3 flex max-h-[95vh] max-w-xl grow cursor-pointer rounded-md bg-neutral-900/10 p-1 text-neutral-500 backdrop-blur-sm"
	>
		<input
			bind:this={input}
			on:input={handleInput}
			multiple
			type="file"
			accept="video/*"
			class="invisible absolute bottom-0 left-0 right-0 top-0 appearance-none"
		/>
		<div
			class="box-content flex grow flex-col items-center gap-2 rounded-md border-4 border-dotted border-neutral-500 border-opacity-10 opacity-90"
		>
			<div class="flex flex-col items-center justify-center gap-2">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-56 w-56"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
					/>
				</svg>

				<h1 class="italic">Drag and Drop files here</h1>

				<span>or</span>

				<h1 class="flex items-center gap-2 rounded-md px-4 py-2 hover:bg-neutral-800/10">
					<span class="italic">Browse files</span>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="h-5 w-5 rotate-45"
					>
						<path
							fill-rule="evenodd"
							d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1zM5.05 3.05a.75.75 0 011.06 0l1.062 1.06A.75.75 0 116.11 5.173L5.05 4.11a.75.75 0 010-1.06zm9.9 0a.75.75 0 010 1.06l-1.06 1.062a.75.75 0 01-1.062-1.061l1.061-1.06a.75.75 0 011.06 0zM3 8a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 013 8zm11 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 0114 8zm-6.828 2.828a.75.75 0 010 1.061L6.11 12.95a.75.75 0 01-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zm3.594-3.317a.75.75 0 00-1.37.364l-.492 6.861a.75.75 0 001.204.65l1.043-.799.985 3.678a.75.75 0 001.45-.388l-.978-3.646 1.292.204a.75.75 0 00.74-1.16l-3.874-5.764z"
							clip-rule="evenodd"
						/>
					</svg>
				</h1>
			</div>

			{#if $files.length > 0}
				<div class=" m-3 flex max-h-[47.5vh] flex-wrap justify-start gap-2 overflow-y-scroll">
					{#each $files as file (file.hash)}
						{#if file.isPreviewAvailable}
							{@const fileSize = (file.file.size / (1024 * 1024)).toFixed(2)}
							<div class="relative w-[255px] overflow-hidden rounded-lg">
								<img src={file.url} alt="" class="aspect-video w-full" />

								<div
									class="absolute left-0 right-0 top-0 flex items-center justify-between overflow-hidden rounded bg-neutral-800/40 p-1 backdrop-blur-sm"
								>
									<div class="w-4/5">
										<p class="max-h-5 text-ellipsis text-sm font-normal text-neutral-100/70">
											{file.file.name}
										</p>

										<div>
											<p class="text-xs font-normal text-neutral-100/60">
												{fileSize} MB
											</p>
										</div>
									</div>

									<button
										type="button"
										class="group/remove"
										title="Remove Video"
										on:click|stopPropagation={() => removeFile(file.hash)}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="h-5 w-5 fill-neutral-100/90 group-hover/remove:fill-red-500/90"
										>
											<path
												d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
											/>
										</svg>
									</button>
								</div>
							</div>
						{:else}
							<div class="aspect-video w-[255px] animate-pulse rounded bg-neutral-800" />
						{/if}
					{/each}
				</div>

				<div class="flex w-full">
					<button
						on:click|stopPropagation
						disabled={loading}
						type="submit"
						class="mx-3 mb-4 grow rounded-lg bg-blue-900 px-4 py-2.5 text-center text-sm font-medium text-blue-100 hover:bg-blue-700/90 focus:outline-none"
					>
						{#if loading}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								xmlns:xlink="http://www.w3.org/1999/xlink"
								style="margin: auto; background: none; display: block; shape-rendering: auto;"
								width="25px"
								height="25px"
								viewBox="0 0 100 100"
								preserveAspectRatio="xMidYMid"
							>
								<circle
									class="stroke-slate-50"
									cx="50"
									cy="50"
									fill="none"
									stroke="#b0b0b0"
									stroke-width="10"
									r="35"
									stroke-dasharray="164.93361431346415 56.97787143782138"
								>
									<animateTransform
										attributeName="transform"
										type="rotate"
										repeatCount="indefinite"
										dur="1s"
										values="0 50 50;360 50 50"
										keyTimes="0;1"
									/>
								</circle>
							</svg>
						{:else}
							<span>Upload</span>
						{/if}
					</button>
				</div>
			{:else}
				<span />

				<span />
			{/if}
		</div>
	</form>
</Modal>
