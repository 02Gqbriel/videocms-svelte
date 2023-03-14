import { writable } from 'svelte/store';

export const url = import.meta.env.VITE_API_URL;

export const confirmation = writable<boolean>(false);

export const fileUpload = writable<boolean>(false);

export const newFolder = writable<boolean>(false);
