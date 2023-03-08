<script lang="ts">
	import { token, tokenExp, url } from './stores';
	import { Toaster } from 'svelte-french-toast';

	async function check() {
		if ($token == 'undefined') return;

		const response = await fetch(`${url}/api/auth/check`, {
			headers: {
				Authorization: 'Basic ' + $token,
				'Access-Control-Allow-Headers': 'Authorization',
				'Access-Control-Allow-Credentials': 'true',
			},
		});

		if (response.ok) {
			const json = (await response.json()) as { exp: string; username: string };

			const { exp, username } = json;

			const date = Date.parse(exp);

			tokenExp.set(date.toString());

			return;
		}

		token.set('undefined');
	}
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
	{#await check()}
		loading
	{:then _}
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
