<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { dragend, dragging } from '$lib/util/dragndrop';

	import { url } from '$lib/util/stores';
</script>

<div
	on:pointerup|stopPropagation={() => $dragging && dragend(null, true)}
	style="cursor: {$dragging ? 'grabbing' : 'auto'};"
	class="flex flex-col justify-between min-h-screen h-screen overflow-hidden"
>
	<Header />

	<main class="flex grow"><slot /></main>

	<footer
		class="md:flex hidden bg-neutral-900/90 fixed bottom-0 z-50 left-[50%] justify-evenly backdrop-blur-sm backdrop-opacity-80 -translate-x-[50%] text-xs text-neutral-500 gap-3 px-2 rounded-t-xl items-center"
	>
		<a
			href="{url}/3b5202e3-935b-4ea5-add1-480a5b6296d4"
			target="_blank"
			class="hover:underline decoration-dashed"
			rel="noreferrer"
		>
			Video Player Example
		</a>

		<span class="font-bold text-base">·</span>

		<a
			href="https://documenter.getpostman.com/view/15650779/2s93CPrY2w"
			target="_blank"
			rel="noreferrer"
			class="hover:underline decoration-dashed"
		>
			Api Documentation
		</a>

		<span class="font-bold text-base">·</span>

		<a
			href="https://hub.docker.com/r/kirari04/videocms"
			target="_blank"
			rel="noreferrer"
			class="hover:underline decoration-dashed"
		>
			Docker Image
		</a>
	</footer>
</div>
