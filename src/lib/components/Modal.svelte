<script lang="ts">
	export let showModal: boolean; // boolean

	let dialog: HTMLDialogElement; // HTMLDialogElement

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
	class="bg-transparent border-none max-h-none max-w-none py-0 px-5 m-0 w-screen h-screen flex justify-center items-center  backdrop:bg-neutral-950/20"
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<div style="display: contents;" class="z-50 ">
		<slot />
	</div>
</dialog>

<style>
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}

	dialog[open]::backdrop {
		animation: fade 0.15s ease-in-out forwards;
	}

	@keyframes fade {
		from {
			background-color: rgb(10 10 10 / 0.1);
		}
		to {
			background-color: rgb(10 10 10 / 0.55);
		}
	}
</style>
