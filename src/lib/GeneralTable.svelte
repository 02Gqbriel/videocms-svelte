<script lang="ts">
	import type { Audios, Subtitles } from '../util/moreInfo';

	export let tracks: Audios[] | Subtitles[];

	const trackTypes: { [key: string]: Audios[] | Subtitles[] } = {};

	for (let i = 0; i < tracks.length; i++) {
		if (trackTypes[tracks[i].Type] === undefined) {
			trackTypes[tracks[i].Type] = [tracks[i]];
		} else {
			trackTypes[tracks[i].Type].push(tracks[i]);
		}
	}

	console.log(Object.keys(trackTypes));
</script>

<table class="table-auto w-full text-">
	<thead>
		<tr class="text-left text-[0.6rem] border-b border-neutral-800/50">
			<th class="font-thin px-1 pl-0 italic opacity-60 w-full">NAME</th>

			<th class="font-thin px-1 italic opacity-60">LANGUAGE</th>

			<th class="font-thin px-1">{' '}</th>
		</tr>
	</thead>
	<tbody class=" text-xs">
		{#each Object.keys(trackTypes) as type}
			<tr class="border-b border-neutral-600 text-xs">
				<td class="px-0.5 pt-1.5">{type}</td>
			</tr>

			{#each trackTypes[type] as track}
				<tr class="border-b border-neutral-800/30 text-right">
					<td class="font-thin py-1 text-left">{track.Name}</td>

					<td class="font-thin p-1">{track.Lang}</td>

					<td class="font-thin p-1 pr-0">
						{#if track.Ready}
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
					</td>
				</tr>
			{/each}
		{/each}
	</tbody>
</table>
