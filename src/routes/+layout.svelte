<script lang="ts">
	import { Toaster } from 'svelte-french-toast';

	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	import '../app.css';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});
</script>

<QueryClientProvider client={queryClient}>
	<slot />
</QueryClientProvider>

<Toaster
	toastOptions={{
		style:
			'background-color: rgb(38 38 38 / 0.95); color: rgb(229 231 235); width: fit-content; z-index:10000;'
	}}
	position={'top-right'}
	gutter={5}
/>
