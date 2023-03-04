import { writable } from 'svelte/store';

const stored = (localStorage.token as string) ?? 'undefined';

export const token = writable<string>(stored);

token.subscribe(value => value !== 'undefined' && (localStorage.token = value));
