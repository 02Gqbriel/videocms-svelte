<script lang="ts">
	import { deleteFileInfo } from '$lib/util/fileinfostack';
	import {
		getFileInfos,
		type FileInfos,
		type Quality,
		type Type,
		type Audio,
		type AudioType
	} from '$lib/util/files';
	import { url } from '$lib/util/stores';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import { group, listify } from 'radash';

	export let data: FileInfos;
	export let id: number;

	let grabbing = false;

	dayjs.extend(relativeTime);

	function dragElement(node: HTMLDivElement) {
		let left = window.innerWidth / 2 - node.offsetWidth / 2;
		let top = window.innerHeight / 2 - node.offsetHeight / 2;

		node.style.top = `${top}px`;
		node.style.left = `${left}px`;

		node.addEventListener('mousedown', (ev) => {
			const target = <HTMLDivElement>ev.target;

			if (target.dataset.drag) {
				grabbing = true;
				document.body.style.cursor = 'grabbing';
			}
		});

		window.addEventListener('mousemove', (e) => {
			if (grabbing) {
				left += e.movementX;
				top += e.movementY;
				node.style.top = `${top}px`;
				node.style.left = `${left}px`;
			}
		});

		window.addEventListener('mouseup', () => {
			grabbing = false;
			document.body.style.cursor = 'auto';
		});
	}

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

	let qualities = group(
		data.Qualitys.sort((q1, q2) => q2.Height - q1.Height),
		(q) => q.Type
	) as Record<Type, Quality[]>;

	let qualitiesKey = <Type[]>Object.keys(qualities);

	$: data &&
		(qualities = group(
			data.Qualitys.sort((q1, q2) => q2.Height - q1.Height),
			(q) => q.Type
		) as Record<Type, Quality[]>);

	$: qualities && (qualitiesKey = <Type[]>Object.keys(qualities));

	let audios = group(
		data.Audios.sort((q1, q2) => q2.Lang.localeCompare(q1.Lang)),
		(q) => q.Type
	) as Record<AudioType, Audio[]>;

	let audiosKey = <AudioType[]>Object.keys(qualities);

	$: data &&
		(audios = group(
			data.Audios.sort((q1, q2) => q2.Lang.localeCompare(q1.Lang)),
			(q) => q.Type
		) as Record<AudioType, Audio[]>);

	$: audios && (audiosKey = <AudioType[]>Object.keys(audios));

	const reload = async () => {
		data = await getFileInfos(id);
	};
</script>

<div
	use:dragElement
	tabindex="-2"
	class="fixed z-50 mx-2 max-h-[80vh] w-screen max-w-screen-sm overflow-y-auto rounded-lg border-2 border-neutral-800 border-opacity-50 bg-neutral-900/80 shadow-md backdrop-blur-sm focus:z-[100]"
>
	<div
		data-drag="true"
		class="sticky top-0 z-50 flex justify-between overflow-visible bg-neutral-900/90 p-2 backdrop-blur-sm
			{grabbing ? 'cursor-grabbing' : 'cursor-grab'}"
	>
		<h1 data-drag="true" class="text-sm">
			{data.Name}
		</h1>

		<div class="flex items-center gap-1">
			<button class="text-xs">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="h-4 w-4"
				>
					<path
						fill-rule="evenodd"
						d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>

			<button on:click={() => deleteFileInfo(id)}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="h-5 w-5"
				>
					<path
						d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
					/>
				</svg>
			</button>
		</div>

		<button
			on:click={reload}
			title="Refresh"
			class="absolute right-0 top-full z-[150] m-1 rounded-md bg-neutral-900/50 px-1.5 py-1 backdrop-blur-sm hover:bg-neutral-700/20"
		>
			<svg
				style="animation-duration: 300ms; animation-direction: alternate; animation-timing-function: ease-in-out;"
				class="h-4 w-4 fill-current active:animate-spin"
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

	<div class="relative aspect-video w-full overflow-hidden">
		<img src={url + data.Thumbnail} alt="" class="pointer-events-none h-full w-full opacity-75" />

		<div
			class="absolute bottom-0 left-0 m-1 rounded-md bg-neutral-900/50 px-1.5 py-1 text-sm backdrop-blur-sm"
		>
			{(data.Size / (1024 * 1024)).toFixed(2)} MB
		</div>

		<div
			class="absolute bottom-0 right-0 m-1 rounded-md bg-neutral-900/50 px-1.5 py-1 text-sm backdrop-blur-sm"
		>
			{calculateDuration(data.Duration)}
		</div>
	</div>

	<div class="flex flex-col gap-2 px-3 py-1.5 text-sm">
		<div class="flex grow">
			<span class="flex flex-1">Created</span>
			<span class="flex flex-1 flex-col text-start">
				{dayjs(data.CreatedAt).fromNow()}
				<span class="text-xs font-thin">({data.CreatedAt})</span>
			</span>
		</div>

		<div class="flex grow">
			<span class="flex flex-1">Last updated</span>
			<span class="flex flex-1 flex-col text-start">
				{dayjs(data.UpdatedAt).fromNow()}
				<span class="text-xs font-thin">({data.UpdatedAt})</span>
			</span>
		</div>

		<div class="flex grow flex-col gap-0.5">
			<span class="flex flex-1">Qualities</span>

			<div
				class="flex w-full justify-between border-b border-neutral-800 text-[0.65rem] text-xs text-neutral-600"
			>
				<div class="font-thin italic">NAME</div>
				<div class="flex gap-2">
					<span class="font-thin italic">SIZE</span>
					<span class="w-7 text-right font-thin italic">FPS</span>
					<span class="w-20 pr-px text-right font-thin italic">RESOLUTION</span>
					<span class="w-4" />
				</div>
			</div>

			<div class="flex flex-col gap-1 text-xs">
				{#each qualitiesKey as quality}
					<span class="text-left opacity-50">{quality}</span>

					<div class="flex flex-col gap-0.5">
						{#each qualities[quality] as q, i}
							{@const kb = q.Size / 1000}
							{@const size = kb > 1000 ? (kb / 1000).toFixed(2) + ' MB' : kb.toFixed(2) + ' KB'}

							<div class="flex justify-between">
								<p class="text-xs">{q.Name}</p>

								<div class="flex gap-2">
									<p>{size}</p>
									<p class="w-7 text-right">{q.AvgFrameRate.toFixed(1)}</p>
									<p class="w-20 text-right">{q.Width}x{q.Height}</p>

									{#if q.Ready}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="h-4 w-4 fill-green-400 opacity-50"
										>
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
												clip-rule="evenodd"
											/>
										</svg>
									{:else if q.Failed}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="h-4 w-4 fill-red-400 opacity-50"
										>
											<path
												fill-rule="evenodd"
												d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
												clip-rule="evenodd"
											/>
										</svg>
									{:else}
										{@const stroke = 2.4}
										{@const padding = 2}
										{@const radius = 8}
										{@const circumference = radius * 2 * Math.PI}
										{@const strokeDashoffset = circumference - (q.Progress / 150) * circumference}

										<div title={q.Progress + '%'}>
											<svg
												width={radius * padding}
												height={radius * padding}
												class="origin-center -rotate-90"
											>
												<circle
													cx={radius}
													cy={radius}
													r={radius - stroke}
													stroke="currentColor"
													stroke-width={stroke}
													fill="transparent"
													class="text-neutral-700/50"
												/>

												<circle
													cx={radius}
													cy={radius}
													r={radius - stroke}
													stroke="currentColor"
													stroke-width={stroke}
													fill="transparent"
													stroke-dashoffset={strokeDashoffset}
													stroke-dasharray={circumference + ' ' + circumference}
													class="stroke-blue-500"
												/>
											</svg>
										</div>
									{/if}
								</div>
							</div>

							{#if i !== qualities[quality].length - 1}
								<div class="h-px w-full bg-neutral-800/30" />
							{/if}
						{/each}
					</div>
				{/each}
			</div>
		</div>

		<div class="flex grow flex-col gap-0.5">
			<span class="flex flex-1">Audios</span>

			<div
				class="flex w-full justify-between border-b border-neutral-800 text-[0.65rem] text-xs text-neutral-600"
			>
				<div class="font-thin italic">NAME</div>
				<div class="flex gap-2">
					<span class="font-thin italic">LANG</span>

					<span class="w-4" />
				</div>
			</div>

			<div class="flex flex-col gap-1 text-xs">
				{#each audiosKey as audio}
					<span class="text-left opacity-50">{audio}</span>

					<div class="flex flex-col gap-0.5">
						{#each audios[audio] as q, i}
							<div class="flex justify-between">
								<p class="text-xs">{q.Name}</p>

								<div class="flex gap-2">
									<p>{q.Lang}</p>

									{#if q.Ready}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="h-4 w-4 fill-green-400 opacity-50"
										>
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
												clip-rule="evenodd"
											/>
										</svg>
									{:else}
										<div role="status">
											<svg
												aria-hidden="true"
												class="h-4 w-4 animate-spin fill-blue-500 dark:text-neutral-700"
												viewBox="0 0 100 101"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
													fill="currentColor"
												/>
												<path
													d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
													fill="currentFill"
												/>
											</svg>
											<span class="sr-only">Loading...</span>
										</div>
									{/if}
								</div>
							</div>

							{#if i !== audios[audio].length - 1}
								<div class="h-px w-full bg-neutral-800/30" />
							{/if}
						{/each}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
