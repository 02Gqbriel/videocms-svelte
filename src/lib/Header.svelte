<script lang="ts">
	import { refreshItems } from '../util/files';
	//@ts-ignore
	import image from '../assets/logo.png?w=30;40;100&quality=100&format=webp;jpg&picture';
	import { selected } from '../util/selected';
	import { confirmation, fileUpload, newFolder } from '../stores';

	const sources = Object.entries(image.sources) satisfies [
		string,
		{ src: string; w: number }[]
	][];
</script>

<svelte:head>
	{#each sources as [format, images]}
		<link
			rel="preload"
			as="image"
			imagesrcset={images.map(i => i.src + ' ' + i.w + 'w').join(', ')}
			type="image/{format}"
		/>
	{/each}

	<link rel="preload" as="image" href={image.fallback.src} />
</svelte:head>

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
				style="animation-duration: 300ms; animation-direction: alternate; animation-timing-function: ease-in-out;"
				class="fill-current w-4 h-4 active:animate-spin"
				height="32"
				id="refresh"
				viewBox="0 0 32 32"
				width="32"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d=" M16 2 A14 14 0 0 0 2 16 A14 14 0 0 0 16 30 A14 14 0 0 0 26 26 L 23.25 23 A10 10 0 0 1 16 26 A10 10 0 0 1 6 16 A10 10 0 0 1 16 6 A10 10 0 0 1 23.25 9 L19 13 L30 13 L30 2 L26 6 A14 14 0 0 0 16 2 "
				/>
			</svg>
		</button>

		<button
			class="flex items-center gap-2  px-3 py-1.5 rounded hover:bg-neutral-800/50"
			on:click={() => newFolder.set(true)}
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
			class="flex items-center gap-2 ml-1 bg-blue-700 px-3 py-1.5  rounded hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-500"
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

		{#if $selected.length > 0}
			<button
				on:click={async e => {
					e.preventDefault();

					confirmation.set(true);
				}}
				title="Delete selected items"
				class="flex items-center gap-2 ml-1 bg-red-700 px-3 py-1.5 mr-2 rounded hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-500"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="w-5 h-5 mx-px"
				>
					<path
						fill-rule="evenodd"
						d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		{/if}
	</div>
</header>
