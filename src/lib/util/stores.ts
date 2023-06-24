import { writable } from 'svelte/store';

export const url = import.meta.env.VITE_API_URL;

export const confirmation = writable<boolean>(false);

export const fileUpload = writable<boolean>(false);

export const newFolder = writable<boolean>(false);

interface ISortKey {
	key: string | null;
	asc: boolean | null;
}

export const sortKey = writable<ISortKey>({ key: null, asc: null });
