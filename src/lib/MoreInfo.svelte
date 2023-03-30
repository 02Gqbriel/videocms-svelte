<script lang="ts">
	import {
		closeFileInfo,
		currentFileInfo,
		type FileInfo,
	} from '../util/moreInfo';
	import dayjs from 'dayjs';
	import { getFile } from '../util/files';
	import { get } from 'svelte/store';
	import { newFolder, url } from '../stores';
	import QualitiesTable from './QualitiesTable.svelte';
	import GeneralTable from './GeneralTable.svelte';

	export let fileInfo: FileInfo;
	let innerHeight;

	console.log(fileInfo);

	function calculateDuration(duration: number) {
		const ms = Math.round(duration * 1000);
		const sec = Math.round(ms / 1000);

		if (sec < 60) {
			return `0:${sec % 60 < 10 ? '0' + (sec % 60) : sec % 60}`;
		}

		const min = Math.floor(sec / 60);

		if (min < 60) {
			return `${min}:${sec % 60 < 10 ? '0' + (sec % 60) : sec % 60}`;
		}

		const h = Math.floor(min / 60);

		return `${h}:${min % 60 < 10 ? '0' + (min % 60) : min % 60}:${
			sec % 60 < 10 ? '0' + (sec % 60) : sec % 60
		}`;
	}

	let qualities = fileInfo.Qualitys.sort().reverse();

	let audios = fileInfo.Audios.sort((v1, v2) => {
		return v1.Type < v2.Type ? -1 : v1.Type > v2.Type ? 1 : 0;
	});

	let subtitles =
		fileInfo.Subtitles !== null
			? fileInfo.Subtitles.sort((v1, v2) => {
					return v1.Type < v2.Type ? -1 : v1.Type > v2.Type ? 1 : 0;
			  })
			: null;

	async function refresh() {
		qualities = [];
		audios = [];
		subtitles = null;

		const { Qualitys, Audios, Subtitles } = await getFile(get(currentFileInfo));

		qualities = Qualitys.sort().reverse();

		audios = Audios.sort((v1, v2) => {
			return v1.Type < v2.Type ? -1 : v1.Type > v2.Type ? 1 : 0;
		});

		if (Subtitles !== null) {
			subtitles = Subtitles.sort((v1, v2) => {
				return v1.Type < v2.Type ? -1 : v1.Type > v2.Type ? 1 : 0;
			});
		}
	}
</script>

<svelte:window bind:innerHeight />

<div
	style="max-height: {innerHeight - ($newFolder ? 168 : 117) + 'px'};"
	class="relative overflow-x-auto flex-col border-l h-full p-2 border-gray-800 border-opacity-10 pb-7 max-w-md w-full min-w-[400px]"
>
	<div
		class="sticky p-1 -m-2 rounded left-full top-0 flex flex-row-reverse bg-neutral-900/20 backdrop-blur-sm w-min"
	>
		<button
			on:click={closeFileInfo}
			class="w-7 h-7 flex justify-center items-center hover:bg-neutral-800/20 rounded"
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

		<button
			on:click={refresh}
			class="w-7 h-7 flex justify-center items-center hover:bg-neutral-800/20 rounded"
		>
			<svg
				style="animation-duration: 200ms; animation-direction: alternate; animation-timing-function: ease-in-out;"
				class="fill-current w-3 h-3 active:animate-spin"
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
	</div>

	<div class="flex justify-evenly flex-col  gap-3 ">
		<h1 class="text-lg pr-14 max-w-full m  truncate">
			{fileInfo.Name}
		</h1>

		<div class="flex items-center justify-center w-full">
			<img
				src={url + fileInfo.Thumbnail}
				class="aspect-video object-cover"
				alt=""
			/>
		</div>

		<div class="flex flex-col gap-3">
			<div class="flex">
				<span class="flex-1">Size:</span>
				<span class="flex-1 font-light"
					>{Math.round(fileInfo.Size / 10000) / 100} MB</span
				>
			</div>

			<div class="flex">
				<span class="flex-1">Duration:</span>
				<span class="flex-1 font-light">
					{calculateDuration(fileInfo.Duration)}
				</span>
			</div>

			<div class="flex">
				<span class="flex-1">Created:</span>
				<span class="flex-1 flex flex-col font-light">
					{dayjs(fileInfo.CreatedAt).fromNow()}
					<span class="text-xs font-thin">({fileInfo.CreatedAt})</span>
				</span>
			</div>

			<div class="flex">
				<span class="flex-1">Last updated:</span>
				<span class="flex-1 flex flex-col font-light">
					{dayjs(fileInfo.UpdatedAt).fromNow()}
					<span class="text-xs font-thin">({fileInfo.UpdatedAt})</span>
				</span>
			</div>

			<div class="flex flex-col gap-1">
				<span class="flex-1">Qualities:</span>

				{#if qualities.length > 0}
					<QualitiesTable {qualities} />
				{/if}
			</div>

			<div class="flex flex-col gap-1">
				<span class="flex-1">Audios:</span>

				{#if audios.length > 0}
					<GeneralTable tracks={audios} />
				{/if}
			</div>

			{#if subtitles !== null}
				<div class="flex flex-col gap-1">
					<span class="flex-1">Subtitles:</span>

					<GeneralTable tracks={subtitles} />
				</div>
			{/if}
		</div>
	</div>
</div>
