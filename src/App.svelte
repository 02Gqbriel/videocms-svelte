<script lang="ts">
	import { Toaster } from 'svelte-french-toast';
	import { checkAuth, token } from './util/auth';
	//@ts-ignore
	import image from './assets/logo.png?w=500&quality=90&format=webp';
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
		<div class="h-screen w-screen flex justify-center items-center">
			<img
				src={image}
				alt="logo"
				loading="eager"
				decoding="async"
				class="opacity-5 hue"
			/>
		</div>
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

{#await import('./lib/Links.svelte') then { default: Links }}
	<Links />
{/await}
