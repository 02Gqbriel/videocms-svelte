<script lang="ts">
	import type { Writable } from 'svelte/store';

	export let fileUpload: Writable<boolean>;

	let fileInput;

	let files: FileList;

	$: console.log(files);

	function toBase64(e: Event) {
		getBase64(e.target.files.item(0));
	}

	function getBase64(vid) {
		const reader = new FileReader();
		reader.readAsDataURL(vid);

		return new Promise<string>((resolve, reject) => {
			reader.onload = e => {
				resolve(reader.result as string);
			};
		});
	}
	async function uploadFunction(imgBase64) {
		const data = {};
		const imgData = imgBase64.split(',');
		data['image'] = imgData[1];
		console.log(data);
		await fetch(`/upload`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify(data),
		});
	}
</script>

<div
	class="absolute left-0 top-0 w-screen h-screen flex items-center justify-center"
>
	<div
		class=" relative w-screen max-w-xl min-h-min shadow-md  bg-neutral-900/50 backdrop-blur-sm p-2 rounded "
	>
		<input
			title=""
			type="file"
			bind:files
			on:input={toBase64}
			multiple
			class="absolute left-0 top-0 h-full w-full appearance-none opacity-0 cursor-pointer"
		/>
		<button
			class="absolute top-0 right-0 m-5"
			on:click={_ => fileUpload.set(false)}
		>
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
			class="border-2 border-dashed border-neutral-500 rounded-md h-full p-10 cursor-pointer flex flex-col justify-center items-center gap-3"
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
				<span
					class="w-[110%]  h-[0.5px] border border-separate border-neutral-800 px-5"
				/>

				{#each files as file}
					{#await getBase64(file)}
						loading.
					{:then result}
						<video width="320" height="240" controls>
							<source
								src={result}
								type={result.split(';')[0].replace('data:', '')}
							/>
							<track kind="captions" />
							Your browser does not support the video tag.
						</video>
					{/await}
				{/each}
			{/if}
		</div>

		/** look at this:
		https://stackoverflow.com/questions/32699721/javascript-extract-video-frames-reliably
		*/
	</div>
</div>
