<script lang="ts" async="true">
	import type { Writable } from 'svelte/store';
	import { refreshItems, uploadFile } from '../util/files';

	import { instance } from '../util/filePreview';

	export let fileUpload: Writable<boolean>;

	let files: File[];
	let loading: boolean = false;

	async function getPreview(file: File): Promise<string> {
		const localInstance = await new instance();
		return await localInstance.previewVid(file);
	}

	async function uploadFiles(e: SubmitEvent) {
		e.preventDefault();

		loading = true;
		let succes = true;

		for (const file of files) {
			succes = succes && (await uploadFile(file));
		}

		loading = false;

		if (succes) {
			fileUpload.set(false);
			await refreshItems();
		}
	}

	function handleInput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		files = [...e.currentTarget.files];
	}
</script>

<div
	class="absolute left-0 top-0 w-screen h-screen flex items-center justify-center z-50"
>
	<form
		on:submit={uploadFiles}
		class=" relative  w-screen max-w-xl min-h-min shadow-md  bg-neutral-900/50 backdrop-blur-sm p-2 rounded "
	>
		<input
			title=""
			type="file"
			accept="video/mp4"
			on:input={handleInput}
			multiple
			class="absolute left-0 top-0 h-full w-full max-h-[370px] appearance-none opacity-0 cursor-pointer"
		/>
		<button class="absolute top-0 right-0 m-5" on:click={(_) => fileUpload.set(false)}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-7 h-7 fill-neutral-500 hover:fill-neutral-200 transition-colors"
			>
				<path
					d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
				/>
			</svg>
		</button>
		<div
			on:drop={(e) => console.log(e)}
			class="border-2 border-dashed border-neutral-500 rounded-md h-full p-10 flex flex-col justify-center items-center gap-3"
		>
			<span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.25"
					stroke="currentColor"
					class="w-56 h-56 stroke-neutral-500 -mt-10"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
					/>
				</svg>
			</span>

			<p class="text-neutral-500 italic">Drag and Drop Files here</p>

			<p>or</p>

			<button class="text-neutral-500 italic flex items-center gap-2">
				<span>browse files</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="w-5 h-5"
				>
					<path
						fill-rule="evenodd"
						d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1zM5.05 3.05a.75.75 0 011.06 0l1.062 1.06A.75.75 0 116.11 5.173L5.05 4.11a.75.75 0 010-1.06zm9.9 0a.75.75 0 010 1.06l-1.06 1.062a.75.75 0 01-1.062-1.061l1.061-1.06a.75.75 0 011.06 0zM3 8a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 013 8zm11 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 0114 8zm-6.828 2.828a.75.75 0 010 1.061L6.11 12.95a.75.75 0 01-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zm3.594-3.317a.75.75 0 00-1.37.364l-.492 6.861a.75.75 0 001.204.65l1.043-.799.985 3.678a.75.75 0 001.45-.388l-.978-3.646 1.292.204a.75.75 0 00.74-1.16l-3.874-5.764z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>

			{#if files != undefined}
				<span class="w-full h-[0.5px] border border-separate border-neutral-800 px-5" />

				<div class="flex gap-x-2 flex-wrap justify-between max-h-96 overflow-scroll">
					{#each files as file}
						{#await getPreview(file)}
							<div
								class="w-[49%] aspect-video animate-pulse bg-neutral-700 my-2 rounded flex items-start"
							>
								<span class="p-2">{file.name}</span>
							</div>
						{:then result}
							<div
								class="relative group/video w-[49%] cursor-pointer aspect-video overflow-hidden my-2 rounded-lg"
							>
								<video class="aspect-video object-cover ">
									<source src={result} type={result.split(';')[0].replace('data:', '')} />
									<track kind="captions" />
									Your browser does not support the video tag.
								</video>
								<button
									class="absolute top-0 left-0 p-2 w-full bg-gradient-to-b from-neutral-800/90 to-neutral-50/5"
									on:click={(_) => (files = files.filter((e) => e != file))}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										class="w-5 h-5 fill-neutral-300 float-right hover:fill-red-500 transition-colors"
									>
										<path
											fill-rule="evenodd"
											d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
											clip-rule="evenodd"
										/>
									</svg>
								</button>
								<span
									class="absolute group-hover/video:top-0 p-2 text-xs w-[80%] truncate left-0 -top-full transition-all"
								>
									{file.name}
								</span>
							</div>
						{/await}
					{/each}
				</div>

				<button
					type="submit"
					class="text-white w-full flex-grow bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm  px-5 py-2.5 text-center"
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
						<span>upload</span>
					{/if}
				</button>
			{/if}
		</div>

		<!-- look at this:
		https://stackoverflow.com/questions/32699721/javascript-extract-video-frames-reliably
		-->
	</form>
</div>
