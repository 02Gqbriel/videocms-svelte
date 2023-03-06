import { writable } from 'svelte/store';

const storedToken = (sessionStorage.token as string) ?? undefined;

export const token = writable<string>(storedToken);

token.subscribe(
	value => value !== 'undefined' && (sessionStorage.token = value)
);

const storedTokenExp = (sessionStorage.tokenExp as string) ?? undefined;

export const tokenExp = writable<string>(storedTokenExp);

tokenExp.subscribe(
	value => value !== 'undefined' && (sessionStorage.tokenExp = value)
);

const local = 'http://localhost:3000';

export const url = import.meta.env.API_URL ?? local;
