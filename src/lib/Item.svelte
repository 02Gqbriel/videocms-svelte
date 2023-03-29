<script lang="ts">
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	import { updateFile, updateFolder } from '../util/files';
	import type { Item } from '../util/files';
	import { enterFolder } from '../util/folderTraversing';
	import { selected, selectItem, unselectItem } from '../util/selected';
	import { url } from '../stores';
	import { currentFileInfo, isFileInfoOpen } from '../util/moreInfo';

	export let item: Item;

	let rename = false;
	let ref: HTMLInputElement;
	let value: string = item.Name;

	async function handleRename(e: Event) {
		e.preventDefault();

		const success = await (item.Type == 'Folder'
			? updateFolder(item.ID, item.ParentFolderID, ref.value)
			: updateFile(item.ID, item.ParentFolderID, ref.value));

		if (success) {
			rename = false;
		}
	}

	dayjs.extend(relativeTime);

	function handleClick(
		e: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
	) {
		if (e.defaultPrevented) return;

		if (item.Type == 'Folder') {
			enterFolder(item.ID);
		} else {
			window.open(`${url}/${item.UUID}`, '_blank');
		}
	}

	let isSelected: boolean = false;

	selected.subscribe(v => {
		isSelected = v.some(e => e.id === item.ID && e.type === item.Type);
	});
</script>

<button
	on:click={handleClick}
	class="border-b group/item w-full flex items-center justify-between border-opacity-10
	border-gray-600 cursor-pointer hover:bg-neutral-800/30 {isSelected
		? '!bg-neutral-800/50'
		: ''}"
>
	<div class="flex items-center  gap-2 p-3">
		{#if $selected.some(e => e.id === item.ID && e.type === item.Type)}
			<button
				on:click={e => {
					e.preventDefault();
					unselectItem(item.ID, item.Type, item.Name);
				}}
			>
				<svg
					class="fill-neutral-700 hover:fill-neutral-600 active:fill-neutral-300 mr-1"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="#000000"
					width="24"
					height="24"
				>
					<path
						d="M7 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7zm4 10.414-2.707-2.707 1.414-1.414L11 12.586l3.793-3.793 1.414 1.414L11 15.414z"
					/>
				</svg>
			</button>
		{:else}
			<button
				on:click={e => {
					e.preventDefault();
					selectItem(item.ID, item.Type, item.Name);
				}}
			>
				<svg
					class="fill-neutral-700 hover:fill-neutral-600 active:fill-neutral-300 mr-1"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="#000000"
					width="24"
					height="24"
				>
					<path
						d="M7 5c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2H7zm0 12V7h10l.002 10H7z"
					/>
				</svg>
			</button>
		{/if}

		{#if item.Type == 'File'}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5 fill-blue-700"
			>
				<path
					d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z"
				/>
			</svg>
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5 fill-blue-700"
			>
				<path
					d="M3.75 3A1.75 1.75 0 002 4.75v3.26a3.235 3.235 0 011.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM3.75 9A1.75 1.75 0 002 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-4.5A1.75 1.75 0 0016.25 9H3.75z"
				/>
			</svg>
		{/if}

		<form
			on:submit={handleRename}
			class="flex relative items-center gap-2 p-1 w-max {rename &&
				'border-b border-blue-700 border-opacity-50'}"
		>
			<input
				readonly={!rename}
				bind:this={ref}
				bind:value
				on:click={e => e.preventDefault()}
				on:keydown={e => {
					if (e.key === ' ') {
						e.preventDefault();
					}

					if (e.key === 'Enter') {
						e.preventDefault();
						handleRename(e);
					}
				}}
				class="bg-transparent flex-grow w-full  z-10 absolute  top-0 -translate-y-[-22.5%] right-0 left-0  focus-within:outline-none  {rename
					? ''
					: 'pointer-events-none'}"
			/>

			{#if ref !== undefined}
				<span class="opacity-0">{value}</span>
			{/if}

			{#if rename}
				<div
					class="flex items-center gap-2 absolute z-20 left-full pl-2 opacity-90 p-1"
				>
					<button
						type="submit"
						on:click={e => {
							e.preventDefault();
							handleRename(e);
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							class="rename w-4 h-4"
						>
							<path
								class="rename"
								fill-rule="evenodd"
								d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
								clip-rule="evenodd"
							/>
						</svg>
					</button>

					<button
						on:click={async e => {
							e.preventDefault();
							rename = false;
							ref.value = item.Name;
						}}
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
			{:else}
				<button
					type="button"
					on:click={e => {
						e.preventDefault();
						rename = true;

						const filename = value.split('.')[0];

						ref.setSelectionRange(filename.length, filename.length);

						ref.focus();
					}}
					title="Rename {item.Type}"
					class="absolute opacity-0 left-[80%] group-hover/item:left-full pl-2 group-hover/item:opacity-90 transition-all p-1"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="w-4 h-4"
					>
						<path
							d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z"
						/>
					</svg>
				</button>
			{/if}
		</form>
	</div>

	<div class="flex mr-2 px-3 gap-3">
		{#if !$isFileInfoOpen}
			<div class="flex items-center justify-end  mr-2">
				<span
					title="This {item.Type.toLowerCase()} was created {dayjs(
						item.CreatedAt
					).fromNow()}"
				>
					{dayjs(item.CreatedAt).fromNow()}
				</span>
			</div>
		{/if}

		<button
			disabled={item.Type == 'Folder'}
			on:click={ev => {
				ev.preventDefault();
				isFileInfoOpen.set(true);
				currentFileInfo.set(item.ID);
			}}
			class="enabled:hover:bg-neutral-800 p-1 rounded group/info {item.ID ===
				$currentFileInfo && 'cursor-not-allowed'}"
		>
			<svg
				baseProfile="tiny"
				height="24px"
				id="Layer_1"
				version="1.2"
				viewBox="0 0 24 24"
				width="24px"
				class="w-6 h-6 opacity-75 fill-current {item.Type == 'Folder' &&
					'invisible'}"
				xml:space="preserve"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				><g
					><path
						d="M13.839,17.525c-0.006,0.002-0.559,0.186-1.039,0.186c-0.265,0-0.372-0.055-0.406-0.079c-0.168-0.117-0.48-0.336,0.054-1.4   l1-1.994c0.593-1.184,0.681-2.329,0.245-3.225c-0.356-0.733-1.039-1.236-1.92-1.416C11.456,9.532,11.134,9.5,10.815,9.5   c-1.849,0-3.094,1.08-3.146,1.126c-0.179,0.158-0.221,0.42-0.102,0.626c0.12,0.206,0.367,0.3,0.595,0.222   c0.005-0.002,0.559-0.187,1.039-0.187c0.263,0,0.369,0.055,0.402,0.078c0.169,0.118,0.482,0.34-0.051,1.402l-1,1.995   c-0.594,1.185-0.681,2.33-0.245,3.225c0.356,0.733,1.038,1.236,1.921,1.416c0.314,0.063,0.636,0.097,0.954,0.097   c1.85,0,3.096-1.08,3.148-1.126c0.179-0.157,0.221-0.42,0.102-0.626C14.312,17.543,14.063,17.451,13.839,17.525z"
					/><circle cx="13" cy="6.001" r="2.5" /></g
				></svg
			>
		</button>
	</div>
</button>
