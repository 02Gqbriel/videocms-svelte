<script lang="ts">
	import { getFileInfos } from '$lib/util/files';

	export let closeInfo: () => void;
	export let itemId: number;

	function dragElement(node: HTMLButtonElement) {
		let moving = false;
		let left = window.innerWidth / 2 - node.offsetWidth;
		let top = window.innerHeight / 2 - node.offsetHeight;

		console.log(window.innerHeight / 2 - node.clientHeight, window.innerHeight, node.clientHeight);

		node.style.top = `${top}px`;
		node.style.left = `${left}px`;

		node.addEventListener('mousedown', () => {
			moving = true;
		});

		window.addEventListener('mousemove', (e) => {
			if (moving) {
				left += e.movementX;
				top += e.movementY;
				node.style.top = `${top}px`;
				node.style.left = `${left}px`;
			}
		});

		window.addEventListener('mouseup', () => {
			moving = false;
		});
	}
</script>

<button
	use:dragElement
	class="absolute mx-2 rounded-lg border-2 border-neutral-800 border-opacity-50 bg-neutral-900/80 shadow-md backdrop-blur-sm"
>
	<div class="flex cursor-move justify-between p-2">
		<span />

		<button class="flex items-center gap-1 text-xs">
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

	{#await getFileInfos(itemId)}
		<div>loading...</div>
	{:then data}
		<div class="p-3">
			{data?.Name}
		</div>
	{/await}
</button>
