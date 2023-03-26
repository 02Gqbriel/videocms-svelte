<script lang="ts">
	import {
		closeFileInfo,
		currentFileInfo,
		type FileInfo,
	} from '../util/moreInfo';
	import placeholder from '../assets/placeholder.png';
	import dayjs from 'dayjs';
	import { getFile } from '../util/files';
	import { get } from 'svelte/store';

	export let fileInfo: FileInfo;

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

	async function refresh() {
		qualities = (await getFile(get(currentFileInfo))).Qualitys.sort().reverse();
	}

	let subtitles = fileInfo.Subtitles;
</script>

<div
	class="flex relative overflow-x-scroll h-full flex-col border-l gap-3 border-gray-800 border-opacity-10 p-3 py-5 max-w-md w-full min-w-[400px]"
>
	<button
		on:click={closeFileInfo}
		class="absolute top-0 right-0 m-2 p-1 hover:bg-neutral-800/20 rounded"
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
		class="absolute top-0 right-8 m-2 p-2 hover:bg-neutral-800/20 rounded"
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

	<h1 class="text-lg pr-16 truncate">
		{fileInfo.Name}
	</h1>

	<div class="flex items-center justify-center">
		<img src={placeholder} class="w-full aspect-video object-cover" alt="" />
	</div>

	<div class="flex flex-col gap-2">
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
			<span class="flex-1">Created at:</span>
			<span class="flex-1 flex flex-col font-light">
				{dayjs(fileInfo.CreatedAt).fromNow()}
				<span class="text-xs font-thin">({fileInfo.CreatedAt})</span>
			</span>
		</div>

		<div class="flex">
			<span class="flex-1">Last updated at:</span>
			<span class="flex-1 flex flex-col font-light">
				{dayjs(fileInfo.UpdatedAt).fromNow()}
				<span class="text-xs font-thin">({fileInfo.UpdatedAt})</span>
			</span>
		</div>

		<div class="flex flex-col gap-2">
			<span class="flex-1">Qualities:</span>
			<div
				class="flex divide-y divide-opacity-20 divide-neutral-800 flex-col flex-wrap"
			>
				{#each qualities as quality}
					<div class="px-1 py-1 flex flex-col gap-2 ">
						<div class="flex justify-between items-center">
							<h1 class="font-light text-xs">
								{quality.Name}
							</h1>

							<div class="flex gap-2 items-center">
								<p class="text-xs flex justify-end font-extralight w-[8ch]">
									{quality.AvgFrameRate.toFixed(2)} FPS
								</p>

								<p class="text-xs flex justify-end font-extralight w-[8ch]">
									{quality.Height}x{quality.Width}
								</p>

								<div>
									{#if quality.Ready}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="w-4 h-4 fill-green-400 opacity-50"
										>
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
												clip-rule="evenodd"
											/>
										</svg>
									{:else if quality.Failed}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="w-4 h-4 fill-red-400 opacity-50"
										>
											<path
												fill-rule="evenodd"
												d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
												clip-rule="evenodd"
											/>
										</svg>
									{:else}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											style="animation-duration: 2.5s;"
											class="w-4 h-4 animate-spin  opacity-50"
										>
											<path
												fill-rule="evenodd"
												d="M8.34 1.804A1 1 0 019.32 1h1.36a1 1 0 01.98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 011.262.125l.962.962a1 1 0 01.125 1.262l-.834 1.25c.245.445.443.919.587 1.416l1.473.294a1 1 0 01.804.98v1.361a1 1 0 01-.804.98l-1.473.295a6.95 6.95 0 01-.587 1.416l.834 1.25a1 1 0 01-.125 1.262l-.962.962a1 1 0 01-1.262.125l-1.25-.834a6.953 6.953 0 01-1.416.587l-.294 1.473a1 1 0 01-.98.804H9.32a1 1 0 01-.98-.804l-.295-1.473a6.957 6.957 0 01-1.416-.587l-1.25.834a1 1 0 01-1.262-.125l-.962-.962a1 1 0 01-.125-1.262l.834-1.25a6.957 6.957 0 01-.587-1.416l-1.473-.294A1 1 0 011 10.68V9.32a1 1 0 01.804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 01.125-1.262l.962-.962A1 1 0 015.38 3.03l1.25.834a6.957 6.957 0 011.416-.587l.294-1.473zM13 10a3 3 0 11-6 0 3 3 0 016 0z"
												clip-rule="evenodd"
											/>
										</svg>
									{/if}
								</div>
							</div>
						</div>

						{#if quality.Progress < 100}
							<progress
								class="w-full rounded overflow-hidden h-1"
								max="100"
								value={quality.Progress}
							/>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		{#if subtitles !== null}
			<div class="flex flex-col gap-2">
				<span class="flex-1">Subtitles:</span>
				<div
					class="flex divide-opacity-20 divide-neutral-800 justify-between  flex-wrap"
				>
					{#each subtitles as subtitle}
						<div class="px-1 py-1 flex flex-col gap-2 w-[49%]">
							<div class="flex justify-between items-center">
								<h1 class="font-light text-xs">
									{subtitle.Name}
								</h1>

								<div class="flex gap-2 items-center">
									<p class="text-xs flex justify-end font-extralight w-[8ch]">
										{subtitle.Lang}
									</p>

									<div>
										{#if subtitle.Ready}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
												class="w-4 h-4 fill-green-400 opacity-50"
											>
												<path
													fill-rule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
													clip-rule="evenodd"
												/>
											</svg>
										{:else}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
												style="animation-duration: 2.5s;"
												class="w-4 h-4 animate-spin  opacity-50"
											>
												<path
													fill-rule="evenodd"
													d="M8.34 1.804A1 1 0 019.32 1h1.36a1 1 0 01.98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 011.262.125l.962.962a1 1 0 01.125 1.262l-.834 1.25c.245.445.443.919.587 1.416l1.473.294a1 1 0 01.804.98v1.361a1 1 0 01-.804.98l-1.473.295a6.95 6.95 0 01-.587 1.416l.834 1.25a1 1 0 01-.125 1.262l-.962.962a1 1 0 01-1.262.125l-1.25-.834a6.953 6.953 0 01-1.416.587l-.294 1.473a1 1 0 01-.98.804H9.32a1 1 0 01-.98-.804l-.295-1.473a6.957 6.957 0 01-1.416-.587l-1.25.834a1 1 0 01-1.262-.125l-.962-.962a1 1 0 01-.125-1.262l.834-1.25a6.957 6.957 0 01-.587-1.416l-1.473-.294A1 1 0 011 10.68V9.32a1 1 0 01.804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 01.125-1.262l.962-.962A1 1 0 015.38 3.03l1.25.834a6.957 6.957 0 011.416-.587l.294-1.473zM13 10a3 3 0 11-6 0 3 3 0 016 0z"
													clip-rule="evenodd"
												/>
											</svg>
										{/if}
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
