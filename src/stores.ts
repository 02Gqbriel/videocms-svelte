import { writable } from 'svelte/store';

const stored = (localStorage.token as string) ?? 'undefined';

export const token = writable<string>(stored);

token.subscribe(value => value !== 'undefined' && (localStorage.token = value));

const local = 'http://localhost:3000';
const online = 'https://videocms.senpai.one';

export const url = import.meta.env.API_URL ?? local;
