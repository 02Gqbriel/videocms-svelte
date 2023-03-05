<script lang="ts">
	import Login from './lib/Login.svelte';
	import Main from './lib/Main.svelte';
	import { token, url } from './stores';

	$: token && setInterval(refresh, 1000 * 60 * 5);

	console.log($token);

	async function check() {
		if ($token == 'undefined') return;

		const response = await fetch(`${url}/api/auth/check`, {
			headers: {
				Authorization: 'Basic ' + $token,
				'Access-Control-Allow-Headers': 'Authorization',
				'Access-Control-Allow-Credentials': 'true',
			},
		});

		if (response.ok) return;

		token.set('undefined');
	}

	async function refresh() {
		const response = await fetch(`${url}/api/auth/refresh`, {
			headers: {
				Authorization: 'Basic ' + $token,
				'Access-Control-Allow-Headers': 'Authorization',
				'Access-Control-Allow-Credentials': 'true',
			},
		});

		if (response.ok) {
			return token.set(await response.text());
		}

		return token.set('undefined');
	}
</script>

{#await check()}
	loading
{:then _}
	<div class="min-h-screen">
		{#if $token !== 'undefined'}
			<Main />
		{:else}
			<Login />
		{/if}
	</div>
{/await}
