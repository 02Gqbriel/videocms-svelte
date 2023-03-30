<script lang="ts">
	import type { Qualitys } from '../util/moreInfo';

	export let qualities: Qualitys[];

	const qualityTypes: { [key: string]: Qualitys[] } = {};

	for (let i = 0; i < qualities.length; i++) {
		if (qualityTypes[qualities[i].Type] === undefined) {
			qualityTypes[qualities[i].Type] = [qualities[i]];
		} else {
			qualityTypes[qualities[i].Type].push(qualities[i]);
		}
	}
</script>

td
<table class="table-auto w-full">
	<thead>
		<tr class="text-left text-[0.6rem] border-b border-neutral-800/50">
			<th class="font-thin px-1 pl-0 italic opacity-60 w-full">NAME</th>

			<th class="font-thin px-1 pr-0 -mr-3 italic opacity-60"> SIZE </th>
			<th class="font-thin px-1 italic opacity-60">FPS</th>
			<th class="font-thin px-1 pr-0 -mr-3 italic opacity-60 text-center">
				RESOLUTION
			</th>

			<th class="font-thin px-1">{' '}</th>
		</tr>
	</thead>
	<tbody class=" text-xs">
		{#each Object.keys(qualityTypes) as type}
			<tr class="border-b border-neutral-600 text-xs">
				<td class="px-0.5 pt-1.5">{type}</td>
			</tr>

			{#each qualityTypes[type] as quality}
				{@const size = quality.Size / 1000}

				<tr class="border-b border-neutral-800/30 text-right">
					<td class="font-thin py-1 text-left">{quality.Name}</td>

					<td class="font-thin p-1 flex  w-max"
						>{size > 1000
							? (size / 1000).toFixed(2) + ' MB'
							: size.toFixed(2) + ' KB'}</td
					>

					<td class="font-thin p-1">{quality.AvgFrameRate.toFixed(2)}</td>
					<td class="font-thin p-1">{quality.Width}x{quality.Height}</td>

					<td class="font-thin p-1 pr-0">
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
								class="transform -rotate-90 w-4 h-4 flex justify-center items-center"
							>
								<circle
									cx="8"
									cy="8"
									r="6"
									stroke="currentColor"
									stroke-width="3"
									fill="transparent"
									class="text-neutral-700"
								/>

								<circle
									cx="8"
									cy="8"
									r="6"
									stroke="currentColor"
									stroke-width="3"
									fill="transparent"
									stroke-dashoffset={5 * 2 * Math.PI -
										(quality.Progress / 100) * 5 * 2 * Math.PI}
									stroke-dasharray={5 * 2 * Math.PI}
									class="stroke-blue-500"
								/>
							</svg>
						{/if}
					</td>
				</tr>
			{/each}
		{/each}
	</tbody>
</table>
