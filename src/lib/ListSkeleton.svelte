<div>
	{#each [0, 0, 0, 0] as _}
		<div
			class="h-[50px] border-b border-opacity-10 border-gray-600 w-full flex items-center justify-between"
		>
			<div class="flex items-center">
				<div
					class="h-[20px] m-3 aspect-square animate-pulse bg-neutral-800 w-min rounded"
				/>
				<div
					class="h-[20px] m-2 aspect-square animate-pulse bg-neutral-800 w-min rounded"
				/>

				<div
					class="h-[24px] m-2.5 w-[200px] animate-pulse bg-neutral-800 rounded"
				/>
			</div>

			<div class="flex mr-2">
				<div
					class="h-[24px] m-2.5 w-[150px] animate-pulse bg-neutral-800 rounded"
				/>

				<div
					class="h-[20px] m-2 aspect-square animate-pulse bg-neutral-800 rounded"
				/>
			</div>
		</div>
	{/each}
</div>
