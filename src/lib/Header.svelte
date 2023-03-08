<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { refreshItems } from '../util/files';
	//@ts-ignore
	import image from '../assets/logo.png?w=30;40;100&quality=100&format=webp;jpg&picture';
	const sources = Object.entries(image.sources) satisfies [
		string,
		{ src: string; w: number }[]
	][];

	export let setNewFolder: (v: boolean) => boolean;
	export let fileUpload: Writable<boolean>;
</script>

<header class="w-screen flex justify-between items-center p-3 px-3">
	<h1 class="w-10">
		<picture role="img" aria-label="Backgroundimage for Landingpage">
			{#each sources as [format, images]}
				<source
					width={50}
					height={50}
					srcset={images.map(i => i.src + ' ' + i.w + 'w').join(', ')}
					type="image/{format}"
				/>
			{/each}

			<img
				src={image.fallback.src}
				width={50}
				height={50}
				alt=""
				loading="eager"
				decoding="async"
			/>
		</picture>
	</h1>

	<div class="flex gap-1 text-sm items-center">
		<button
			title="Refresh"
			class="flex items-center gap-2  px-1.5 py-1.5 rounded hover:bg-neutral-800/50"
			on:click={refreshItems}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5"
			>
				<path
					fill-rule="evenodd"
					d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>

		<button
			class="flex items-center gap-2  px-3 py-1.5 rounded hover:bg-neutral-800/50"
			on:click={v => setNewFolder(true)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5"
			>
				<path
					fill-rule="evenodd"
					d="M3.75 3A1.75 1.75 0 002 4.75v10.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-8.5A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM10 8a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 0110 8z"
					clip-rule="evenodd"
				/>
			</svg>
			<span>New folder</span>
		</button>
		<button
			on:click={() => fileUpload.set(true)}
			class="flex items-center gap-2 ml-1 bg-blue-700 px-3 py-1.5 mr-2 rounded hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-500"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5"
			>
				<path
					fill-rule="evenodd"
					d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zM10 8a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 0110 8z"
					clip-rule="evenodd"
				/>
			</svg>

			<span>New file</span>
		</button>
	</div>
</header>
