<script lang="ts">
	import moment from 'moment';
	import { onMount } from 'svelte';
	import { get, writable } from 'svelte/store';
	import { token, tokenExp, url } from '../stores';
	import VirtualList from '@sveltejs/svelte-virtual-list';
	import toast from 'svelte-french-toast';

	let fileUpload = writable<boolean>(false);
	let newFolder = false;
	let innerHeight: number;

	let files: {
		ID: number;
		CreatedAt: string;
		UpdatedAt: string;
		DeletedAt: string | null;
		Name: string;
		UserID: number;
		ParentFolderID: number;
		Type: 'Folder' | 'File';
	}[] = [];

	onMount(() => {
		if (!Number.isNaN(Number(get(tokenExp)))) {
			setTimeout(
				refresh,
				moment(Number(get(tokenExp))).diff(Date.now(), 'millisecond') - 5000
			);
		}
	});

	async function refresh() {
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
					refresh,
					moment(Number($tokenExp)).diff(Date.now(), 'millisecond') - 5000
				);
			}

			return;
		}

		return token.set('undefined');
	}

	async function listAll() {
		const responseFolders = await fetch(`${url}/api/folders`, {
			headers: {
				Authorization: 'Basic ' + $token,
				'Access-Control-Allow-Headers': 'Authorization',
				'Access-Control-Allow-Credentials': 'true',
			},
		});

		files = [
			...((await responseFolders.json()).map(v => ({
				...v,
				Type: 'Folder',
			})) as {
				ID: number;
				CreatedAt: string;
				UpdatedAt: string;
				DeletedAt: string | null;
				Name: string;
				UserID: number;
				ParentFolderID: number;
				Type: 'Folder' | 'File';
			}[]),
		];

		const responseFiles = await fetch(`${url}/api/files`, {
			headers: {
				Authorization: 'Basic ' + $token,
				'Access-Control-Allow-Headers': 'Authorization',
				'Access-Control-Allow-Credentials': 'true',
			},
		});

		const jsonFiles = (await responseFiles.json()) as {
			ID: number;
			CreatedAt: string;
			UpdatedAt: string;
			DeletedAt: string | null;
			UUID: string;
			UserID: number;
			ParentFolderID: number;
		}[];

		console.log(jsonFiles);

		files = [
			...files,
			...jsonFiles.map(v => ({
				...v,
				Type: 'File' as 'File' | 'Folder',
				Name: v.UUID,
			})),
		];
	}

	async function createFolder() {
		const formData = new FormData();

		formData.append('name', 'test_' + Date.now());

		const response = await fetch(`${url}/api/folder`, {
			method: 'POST',
			headers: {
				Authorization: 'Basic ' + $token,
				'Access-Control-Allow-Headers': 'Authorization',
				'Access-Control-Allow-Credentials': 'true',
			},
			body: formData,
		});
	}

	async function deleteFile(file: {
		ID: number;
		CreatedAt: string;
		UpdatedAt: string;
		DeletedAt: string | null;
		Name: string;
		UserID: number;
		ParentFolderID: number;
		Type: 'Folder' | 'File';
	}) {
		const formData = new FormData();

		formData.append('LinkID', file.ID.toString());

		const response = await fetch(`${url}/api/file`, {
			method: 'DELETE',
			headers: {
				Authorization: 'Basic ' + $token,
				'Access-Control-Allow-Headers': 'Authorization',
				'Access-Control-Allow-Credentials': 'true',
			},
			body: formData,
		});

		if (response.ok) {
			toast.success('File successfully deleted');
			await listAll();
		}
	}

	async function deleteFolder(file: {
		ID: number;
		CreatedAt: string;
		UpdatedAt: string;
		DeletedAt: string | null;
		Name: string;
		UserID: number;
		ParentFolderID: number;
		Type: 'Folder' | 'File';
	}) {
		const formData = new FormData();

		formData.append('LinkID', file.ID.toString());

		const response = await fetch(`${url}/api/file`, {
			method: 'DELETE',
			headers: {
				Authorization: 'Basic ' + $token,
				'Access-Control-Allow-Headers': 'Authorization',
				'Access-Control-Allow-Credentials': 'true',
			},
			body: formData,
		});

		if (response.ok) {
			toast.success('File successfully deleted');
			await listAll();
		}
	}
</script>

<svelte:window bind:innerHeight />

{#if $fileUpload}
	{#await import('./File.svelte') then { default: File }}
		<svelte:component this={File} {fileUpload} {listAll} />
	{/await}
{/if}

<header class="w-screen flex justify-between items-center p-3 px-3">
	<h1><img src="/logo.png" alt="logo" class="w-10" /></h1>

	<div class="flex gap-1 text-sm items-center">
		<button
			title="Refresh"
			class="flex items-center gap-2  px-1.5 py-1.5 rounded hover:bg-neutral-800/50"
			on:click={listAll}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5"
			>
				<path
					fill-rule="evenodd"
					d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>

		<button
			class="flex items-center gap-2  px-3 py-1.5 rounded hover:bg-neutral-800/50"
			on:click={v => (newFolder = true)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5"
			>
				<path
					fill-rule="evenodd"
					d="M3.75 3A1.75 1.75 0 002 4.75v10.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-8.5A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM10 8a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 0110 8z"
					clip-rule="evenodd"
				/>
			</svg>
			<span>New folder</span>
		</button>
		<button
			on:click={() => fileUpload.set(true)}
			class="flex items-center gap-2 ml-1 bg-blue-700 px-3 py-1.5 mr-2 rounded hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-500"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5"
			>
				<path
					fill-rule="evenodd"
					d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zM10 8a.75.75 0 01.75.75v1.5h1.5a.75.75 0 010 1.5h-1.5v1.5a.75.75 0 01-1.5 0v-1.5h-1.5a.75.75 0 010-1.5h1.5v-1.5A.75.75 0 0110 8z"
					clip-rule="evenodd"
				/>
			</svg>

			<span>New file</span>
		</button>
	</div>
</header>

<div class="s">
	{#await listAll()}
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
				items={files}
				let:item
			>
				<div
					class="border-b flex items-center justify-between border-opacity-10 border-gray-600  cursor-pointer hover:bg-neutral-800/50"
				>
					<div class="flex items-center  gap-2 p-3">
						{#if item.Type == 'File'}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="w-5 h-5 fill-blue-700"
							>
								<path
									d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z"
								/>
							</svg>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="w-5 h-5 fill-blue-700"
							>
								<path
									d="M3.75 3A1.75 1.75 0 002 4.75v3.26a3.235 3.235 0 011.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM3.75 9A1.75 1.75 0 002 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-4.5A1.75 1.75 0 0016.25 9H3.75z"
								/>
							</svg>
						{/if}

						<p>{item.Name}</p>
					</div>

					<div class="flex items-center justify-between w-96">
						<span
							title="This {item.Type.toLowerCase()} was created {moment(
								item.CreatedAt
							).fromNow()}"
						>
							{moment(item.CreatedAt).fromNow()}
						</span>

						<div class="flex w-8 justify-end items-center">
							<span class="sm:hidden inline">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="w-5 h-5"
								>
									<path
										d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z"
									/>
								</svg>
							</span>

							<span class="sm:flex hidden gap-2 items-center mr-3">
								{#if item.Type == 'File'}
									<span
										title="Preview"
										class="hover:bg-neutral-800/50 p-1 rounded"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="w-5 h-5"
										>
											<path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
											<path
												fill-rule="evenodd"
												d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
												clip-rule="evenodd"
											/>
										</svg>
									</span>
								{/if}

								<span
									title="Edit {item.Type}"
									class=" p-1 rounded flex items-center gap-1 font-semibold px-2 hover:bg-neutral-800/50"
								>
									<span>Edit</span>

									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										class="w-5 h-5"
									>
										<path
											d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z"
										/>
										<path
											d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z"
										/>
									</svg>
								</span>

								<button
									on:click={() => deleteFile(item)}
									title="Delete {item.Type}"
									class="bg-red-500 p-1 rounded flex items-center gap-1 font-semibold px-2 hover:bg-red-900/90"
								>
									<span>Delete</span>

									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										class="w-5 h-5 "
									>
										<path
											fill-rule="evenodd"
											d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
											clip-rule="evenodd"
										/>
									</svg>
								</button>
							</span>
						</div>
					</div>
				</div>
			</VirtualList>
		</div>
	{/await}
</div>
