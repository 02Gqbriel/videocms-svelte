<script lang="ts">
	import { token, tokenExp, url } from './stores';

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

<div class="text-gray-200 bg-neutral-900">
	{#await check()}
		loading
	{:then _}
		<div class="min-h-screen ">
			{#if $token !== 'undefined'}
				{#await import('./lib/Main.svelte') then { default: Main }}
					<svelte:component this={Main} />
				{/await}
			{:else}
				{#await import('./lib/Login.svelte') then { default: Login }}
					<svelte:component this={Login} />
				{/await}
			{/if}
		</div>
	{/await}
</div>
