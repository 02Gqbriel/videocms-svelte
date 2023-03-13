<script lang="ts">
	import { Toaster } from 'svelte-french-toast';
	import { checkAuth, token } from './util/auth';
</script>

<Toaster
	toastOptions={{
		style:
			'background-color: rgb(38 38 38 / 0.95); color: rgb(229 231 235); width: fit-content;',
	}}
	position={'top-right'}
	gutter={5}
/>

<div style="overflow-x: overlay;" class="text-gray-200 bg-neutral-900">
	{#await checkAuth()}
		loading
	{:then}
		<div class="min-h-screen ">
			{#if $token !== 'undefined'}
				<div class="max-h-screen overflow-hidden">
					{#await import('./lib/Main.svelte') then { default: Main }}
						<svelte:component this={Main} />
					{/await}
				</div>
			{:else}
				{#await import('./lib/Login.svelte') then { default: Login }}
					<svelte:component this={Login} />
				{/await}
			{/if}
		</div>
	{/await}
</div>
