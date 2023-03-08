<script lang="ts">
	import moment from 'moment';
	import { onMount } from 'svelte';
	import { get, writable } from 'svelte/store';
	import { token, tokenExp, url } from '../stores';
	import VirtualList from './VirtualList.svelte';
	import { files, refreshItems, type Item } from '../util/files';
	import { default as ListItem } from './Item.svelte';

	let fileUpload = writable<boolean>(false);
	let newFolder = false;
	let innerHeight: number;

	onMount(() => {
		if (!Number.isNaN(Number(get(tokenExp)))) {
			setTimeout(
				refreshAuth,
				moment(Number(get(tokenExp))).diff(Date.now(), 'millisecond') - 5000
			);
		}
	});

	let filesArray: Item[] = Array.from($files.values());
	files.subscribe(v => {
		console.log('set', v);

		filesArray = Array.from(v).filter(
			(item, index, arr) => arr.indexOf(item) === index
		);
	});

	$: console.log(filesArray);

	async function refreshAuth() {
		const response = await fetch(`${url}/api/auth/refresh`, {
			headers: {
				Authorization: 'Basic ' + $token,
				'Access-Control-Allow-Headers': 'Authorization',
				'Access-Control-Allow-Credentials': 'true',
			},
		});

		if (response.ok) {
			const { exp, token: tokenNew } = (await response.json()) as {
				exp: string;
				token: string;
			};

			token.set(tokenNew);
			tokenExp.set(Date.parse(exp).toString());

			if (
				!Number.isNaN(Number($tokenExp)) &&
				moment(Number($tokenExp)).diff(Date.now(), 'millisecond') > 0
			) {
				setTimeout(
					refreshAuth,
					moment(Number($tokenExp)).diff(Date.now(), 'millisecond') - 5000
				);
			}

			return;
		}

		return token.set('undefined');
	}
</script>

<svelte:window bind:innerHeight />

{#if $fileUpload}
	{#await import('./File.svelte') then { default: File }}
		<svelte:component this={File} {fileUpload} />
	{/await}
{/if}

{#await import('./Header.svelte') then { default: Header }}
	<svelte:component this={Header} {newFolder} {fileUpload} />
{/await}

<div class="s">
	{#await refreshItems()}
		<div>
			<div>l</div>
		</div>
	{:then _}
		<div class="text-sm">
			{#if newFolder}
				<div class="h-12 w-screen shadow-xl p-3">
					<input
						placeholder="New folder name"
						type="text"
						class="bg-transparent focus:outline-none placeholder:italic"
						autofocus
					/>
				</div>
			{/if}
			<VirtualList
				height={innerHeight - (newFolder ? 118 : 70) + 'px'}
				items={filesArray}
				let:item
			>
				<ListItem {item} />
			</VirtualList>
		</div>
	{/await}
</div>
