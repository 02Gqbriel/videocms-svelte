<script lang="ts">
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';

	import { updateFolder } from '../util/files';
	import type { Item } from '../util/files';
	import { enterFolder } from '../util/folderTraversing';
	import { selected, selectItem, unselectItem } from '../util/selected';
	import { url } from '../stores';
	import { draggedItem, dragging } from '../util/moveFolder';

	export let item: Item;

	let rename = false;
	let ref: HTMLInputElement;

	async function handleRename(e: Event) {
		e.preventDefault();

		const success = await updateFolder(item.ID, item.ParentFolderID, ref.value);

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
</script>

{#if $dragging && draggedItem.item == item}
	{#await import('./DragItem.svelte') then { default: DragItem }}
		<svelte:component this={DragItem} {item} />
	{/await}
{/if}

<button
	on:click={handleClick}
	class="border-b group/item w-full flex items-center justify-between border-opacity-10
	border-gray-600 cursor-pointer hover:bg-neutral-800/50"
>
	<div class="flex items-center  gap-2 p-3">
		{#if $selected.some((e) => e.id === item.ID && e.type === item.Type)}
			<button
				on:click={(e) => {
					e.preventDefault();
					unselectItem(item.ID, item.Type);
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
				on:click={(e) => {
					e.preventDefault();
					selectItem(item.ID, item.Type);
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

		<form on:submit={handleRename} class="flex relative items-center gap-2">
			<input
				readonly={!rename}
				value={item.Name}
				bind:this={ref}
				on:click={(e) => e.preventDefault()}
				on:input={() => (ref.style.width = ref.value.length + 'ch')}
				on:keydown={(e) => {
					if (e.key === ' ') {
						e.preventDefault();
						ref.value += ' ';
					}
				}}
				style="width: {item.Name.length + 'ch'};"
				class="bg-neutral-900 group-hover/item:bg-neutral-800/0 z-10 active:outline-none focus:outline-none {rename
					? ''
					: 'pointer-events-none'}"
			/>

			{#if item.Type == 'Folder'}
				{#if rename}
					<div class="flex items-center gap-2 absolute -right-12 pl-2 opacity-90 p-1">
						<button
							type="submit"
							on:click={(e) => {
								e.preventDefault;
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
							on:click={async (e) => {
								e.preventDefault();
								rename = false;
								ref.value = item.Name;
								ref.style.width = ref.value.length + 'ch';
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
						on:click={(e) => {
							e.preventDefault();
							rename = true;
							ref.focus();
						}}
						title="Rename {item.Type}"
						class="absolute opacity-0 right-0 group-hover/item:-right-6 pl-2 group-hover/item:opacity-90 transition-all p-1"
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
			{/if}
		</form>
	</div>

	<div class="flex items-center justify-end w-96 px-3 mr-2">
		<span
			title="This {item.Type.toLowerCase()} was created {dayjs(item.CreatedAt).fromNow()}"
		>
			{dayjs(item.CreatedAt).fromNow()}
		</span>
	</div>
</button>
