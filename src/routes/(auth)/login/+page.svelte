<script lang="ts">
	import { goto } from '$app/navigation';
	import { checkAuth, isLoggedIn, login } from '$lib/util/auth';
	import { onMount, tick } from 'svelte';
	import toast from 'svelte-french-toast';

	let loading: boolean = false;

	let username: string;
	let password: string;

	onMount(async () => {
		if (await isLoggedIn()) {
			goto('/');
			toast.success('Already Logged in');
		}
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		loading = true;

		await login(username, password);

		loading = false;

		await tick();

		goto('/');
	}
</script>

<form
	class="max-w-screen-sm mx-auto flex justify-center flex-col h-screen p-4 md:p-16 gap-5"
	method="POST"
	on:submit={handleSubmit}
>
	<h1 class="text-5xl px-1 font-bold pb-5">Login</h1>

	<fieldset class="p-1">
		<label for="username" class="block mb-1.5 text-sm">Username</label>
		<input
			type="text"
			id="username"
			class="bg-neutral-800/50 border-2 border-neutral-800 text-sm rounded-lg focus:ring-blue-900/50 focus:border-blue-800 focus:ring-4 caret-blue-900 block w-full px-2 py-3 outline-none placeholder:text-neutral-600"
			placeholder="e.g. John Doe"
			required
			autocomplete="username"
			bind:value={username}
		/>
	</fieldset>

	<fieldset class="p-1">
		<label for="password" class="block mb-1.5 text-sm">Password</label>
		<input
			type="password"
			id="password"
			class="bg-neutral-800/50 border-2 border-neutral-800 text-sm rounded-lg focus:ring-blue-900/50 focus:border-blue-800 focus:ring-4 caret-blue-900 block w-full px-2 py-3 outline-none placeholder:text-neutral-600"
			placeholder="******************"
			required
			autocomplete="password"
			bind:value={password}
		/>
	</fieldset>

	<button
		disabled={loading}
		type="submit"
		class="text-white bg-blue-700 mx-1 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mt-5 mb-10"
	>
		{#if loading}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				style="margin: auto; background: none; display: block; shape-rendering: auto;"
				width="25px"
				height="25px"
				viewBox="0 0 100 100"
				preserveAspectRatio="xMidYMid"
			>
				<circle
					class="stroke-slate-50"
					cx="50"
					cy="50"
					fill="none"
					stroke="#b0b0b0"
					stroke-width="10"
					r="35"
					stroke-dasharray="164.93361431346415 56.97787143782138"
				>
					<animateTransform
						attributeName="transform"
						type="rotate"
						repeatCount="indefinite"
						dur="1s"
						values="0 50 50;360 50 50"
						keyTimes="0;1"
					/>
				</circle>
			</svg>
		{:else}
			<span>Submit</span>
		{/if}
	</button>
</form>
