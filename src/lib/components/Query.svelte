<script lang="ts">
	import type { QueryObserverSuccessResult } from '@tanstack/svelte-query';

	type T = $$Generic;

	export let query: UseQueryStoreResult<T, unknown>;

	interface $$Slots {
		default: { data: T };
		error: {};
		loading: {};
	}
</script>

{#if $query.isLoading || $query.isFetching}
	<slot name="loading">Loading...</slot>
{:else if $query.isError}
	<slot name="error">An error occurred</slot>
{:else if $query.isSuccess}
	<slot data={$query.data} />
{/if}
