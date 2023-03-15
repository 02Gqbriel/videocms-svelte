<script lang="ts">
	import { login } from '../util/auth';

	let loading: boolean = false;

	let username: string;
	let password: string;

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		loading = true;

		await login(username, password);

		loading = false;
	}
</script>

<form
	class="max-w-screen-sm mx-auto flex justify-center flex-col h-screen p-16 gap-5"
	method="POST"
	autocomplete="new-password"
	on:submit={handleSubmit}
>
	<h1 class="text-5xl  font-bold mb-5">Login</h1>

	<fieldset class="">
		<label for="username" class="block mb-2 text-sm font-medium">Username</label>
		<input
			type="text"
			id="username"
			class="bg-neutral-800 border border-neutral-700 text-sm rounded-lg focus:ring-blue-700 focus:border-blue-700 block w-full p-2.5 outline-none"
			placeholder="e.g. John Doe"
			required
			autocomplete="new-password"
			bind:value={username}
		/>
	</fieldset>

	<fieldset class="">
		<label for="password" class="block mb-2 text-sm font-medium ">Password</label>
		<input
			type="password"
			id="password"
			class="bg-neutral-800 border border-neutral-700 text-sm rounded-lg focus:ring-blue-700 focus:border-blue-700 block w-full p-2.5 outline-none"
			placeholder="******************"
			required
			autocomplete="new-password"
			bind:value={password}
		/>
	</fieldset>

	<button
		disabled={loading}
		type="submit"
		class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-500 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mt-5 mb-10"
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
			<span>submit</span>
		{/if}
	</button>
</form>
