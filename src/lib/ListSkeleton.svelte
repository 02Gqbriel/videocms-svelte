<div>
	{#each [0, 0, 1, 1, 1] as i}
		<div
			class="h-[50px] border-b border-opacity-10 border-gray-600 w-full flex items-center justify-between"
		>
			<div class="flex items-center">
				<div
					class="h-[20px] m-2.5 ml-3.5 mr-1.5 aspect-square animate-pulse bg-neutral-800 w-min rounded"
				/>
				<div
					class="h-[20px] m-2 aspect-square animate-pulse bg-neutral-800 w-min rounded"
				/>

				<div
					class="h-[20px] m-1 w-[200px] animate-pulse bg-neutral-800 rounded"
				/>
			</div>

			<div class="flex mr-4 items-center">
				<div
					class="h-[20px] m-2 mr-3.5 w-[125px] animate-pulse bg-neutral-800 rounded"
				/>

				{#if i == 1}
					<div
						class="h-[20px] m-2.5 aspect-square animate-pulse bg-neutral-800 rounded"
					/>
				{:else}
					<div class="h-[20px] m-2.5 aspect-square invisible" />
				{/if}
			</div>
		</div>
	{/each}
</div>
