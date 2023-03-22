import { get, writable } from 'svelte/store';
import { refreshItems } from './files';

export const currentFolderID = writable<number>(0);

const history: number[] = [];

export async function enterFolder(ID: number) {
	history.push(get(currentFolderID));

	currentFolderID.set(ID);

	await refreshItems();
}

export async function leaveFolder() {
	currentFolderID.set(history[history.length - 1]);

	history.pop();

	await refreshItems();
}

export function prevFolder(): number {
	return history[history.length - 1];
}
