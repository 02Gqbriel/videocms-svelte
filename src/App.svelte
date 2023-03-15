<script lang="ts">
	import { Toaster } from 'svelte-french-toast';
	import { url } from './stores';
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

<div
	class="md:flex hidden fixed bottom-0 z-50 left-[50%]  justify-evenly backdrop-blur-sm -translate-x-[50%] text-sm text-neutral-500 gap-3 my-0.5 rounded items-center"
>
	<a
		href="{url}/3b5202e3-935b-4ea5-add1-480a5b6296d4"
		target="_blank"
		class="hover:underline"
		rel="noreferrer"
	>
		Video Player Example
	</a>

	<span class="font-bold text-lg">·</span>

	<a
		href="https://documenter.getpostman.com/view/15650779/2s93CPrY2w"
		target="_blank"
		rel="noreferrer"
		class="hover:underline"
	>
		Api Documentation
	</a>

	<span class="font-bold text-lg">·</span>

	<a
		href="https://hub.docker.com/r/kirari04/videocms"
		target="_blank"
		rel="noreferrer"
		class="hover:underline"
	>
		Docker Image
	</a>
</div>
