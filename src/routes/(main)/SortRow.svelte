<script lang="ts">
	import { isAllSelected, unselectAll } from '$lib/util/selected';
	import { sortKey } from '$lib/util/stores';
	import { back, currentFolderId, forward, history } from '$lib/util/traversing';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { get } from 'svelte/store';

	const queryClient = useQueryClient();

	function selectAll() {
		isAllSelected.set(true);
	}

	function setKey(key: string) {
		const { asc } = get(sortKey);

		if (asc === false) {
			queryClient.refetchQueries({ queryKey: ['files', $currentFolderId] });
			sortKey.set({ key: null, asc: null });
		} else {
			sortKey.set({ key, asc: !asc });
		}
	}
</script>

<div>
	<div
		class="flex items-center justify-between border-b border-neutral-700 border-opacity-10 px-2 py-1 pr-4 text-sm"
	>
		<div class="ml-px flex items-center gap-2.5">
			<button title="Back" on:click={() => back()}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="h-5 w-5 fill-neutral-700 hover:fill-neutral-500"
				>
					<path
						fill-rule="evenodd"
						d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>

			<button title="Forward" on:click={forward} class="ml-1">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="h-5 w-5 fill-neutral-700 hover:fill-neutral-500"
				>
					<path
						fill-rule="evenodd"
						d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>

			<div class="-ml-px flex items-center gap-1 text-xs opacity-50">
				{#each $history as item, index}
					{#if index + 1 !== $history.length}
						<button
							disabled={$currentFolderId === item.id}
							class="hover:opacity-100 {index === 0
								? 'text-lg leading-none tracking-wider'
								: ''} {$currentFolderId === item.id ? 'opacity-100' : 'opacity-50'}"
							on:click={() => back(item.id)}
						>
							{item.name}
						</button>

						<span>></span>
					{:else}
						<button
							disabled={$currentFolderId === item.id}
							class="hover:opacity-75 {$currentFolderId === item.id ? 'opacity-100' : 'opacity-50'}"
							on:click={() => back(item.id)}
						>
							{item.name}
						</button>
					{/if}
				{/each}
			</div>
		</div>
	</div>

	<div
		class="flex items-center justify-between border-b border-neutral-700 border-opacity-10 px-2 py-1 pr-4 text-sm"
	>
		<div class="flex items-center gap-2.5">
			<div class="relative ml-1.5 mr-1 flex">
				<input
					type="checkbox"
					class="h-3.5 w-3.5 cursor-pointer rounded-[25%]"
					bind:checked={$isAllSelected}
					on:click|stopPropagation={() => ($isAllSelected ? unselectAll : selectAll)()}
				/>

				{#if $isAllSelected}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="5"
						stroke="currentColor"
						class="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2.5 -translate-x-1/2 -translate-y-1/2 stroke-blue-200"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
					</svg>
				{/if}
			</div>

			<button title="Filter">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="h-4 w-5 fill-blue-900"
				>
					<path
						fill-rule="evenodd"
						d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>

			<button
				class="flex items-center justify-around gap-1 text-xs"
				on:click={() => setKey('Name')}
			>
				<span class="font-semibold">NAME</span>

				{#if $sortKey.key !== 'Name'}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="h-5 w-5 fill-neutral-700"
					>
						<path
							fill-rule="evenodd"
							d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
							clip-rule="evenodd"
						/>
					</svg>
				{:else if $sortKey.asc}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="h-5 w-5"
					>
						<path
							fill-rule="evenodd"
							d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z"
							clip-rule="evenodd"
						/>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="h-5 w-5"
					>
						<path
							fill-rule="evenodd"
							d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
							clip-rule="evenodd"
						/>
					</svg>
				{/if}
			</button>
		</div>

		<div class="flex gap-2">
			<button
				class="flex w-[122px] items-center justify-start text-xs"
				on:click={() => setKey('UpdatedAt')}
			>
				<span class="font-semibold">LAST MODIFIED</span>

				{#if $sortKey.key !== 'UpdatedAt'}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="h-5 w-5 fill-neutral-700"
					>
						<path
							fill-rule="evenodd"
							d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
							clip-rule="evenodd"
						/>
					</svg>
				{:else if $sortKey.asc}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="h-5 w-5"
					>
						<path
							fill-rule="evenodd"
							d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z"
							clip-rule="evenodd"
						/>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						class="h-5 w-5"
					>
						<path
							fill-rule="evenodd"
							d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
							clip-rule="evenodd"
						/>
					</svg>
				{/if}
			</button>

			<span class="h-5 w-5" />
		</div>
	</div>
</div>
