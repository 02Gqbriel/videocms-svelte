<script lang="ts">
	import Login from './lib/Login.svelte';
	import { token } from './stores';

	console.log($token);

	async function refresh() {
		if ($token == 'undefined') return;

		const response = await fetch('http://localhost:3000/api/auth/check', {
			headers: {
				Authorization: 'Basic ' + $token,
				'Access-Control-Allow-Headers': 'Authorization',
				'Access-Control-Allow-Credentials': 'true',
			},
		});

		console.log(response);

		return await new Promise((resolve, reject) => {
			setTimeout(resolve, 3000);
		});
	}
</script>

{#await refresh()}
	loading
{:then name}
	{name}
	<div class="min-h-screen">
		{#if $token !== 'undefined'}
			<p>logged in</p>
		{:else}
			<Login />
		{/if}
	</div>
{/await}
