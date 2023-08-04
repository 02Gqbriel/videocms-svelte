import { get, writable } from 'svelte/store';
import { unselectAll } from './selected';

interface IFolder {
	id: number;
	name: string;
}

export const currentFolderId = writable<number>(0);

export const history = writable<IFolder[]>([{ id: 0, name: '..' }]);

export function add(id: number, name: string) {
	const historyArray = get(history);

	for (let i = 0; i < historyArray.length; i++) {
		if (historyArray[i].id === get(currentFolderId)) {
			if (historyArray[i + 1] === undefined) {
				currentFolderId.set(id);
				history.set([...get(history), { id, name }]);
				break;
			}

			if (historyArray[i + 1].id === id) {
				currentFolderId.set(id);
			} else {
				historyArray.splice(i + 1);
				history.set([...historyArray, { id, name }]);
				currentFolderId.set(id);
			}

			break;
		}
	}
	unselectAll();
}

export function back(id: number | undefined = undefined) {
	unselectAll();
	const historyArray = get(history);

	if (id === undefined) {
		for (let i = 1; i < historyArray.length; i++) {
			if (historyArray[i].id === get(currentFolderId)) {
				currentFolderId.set(historyArray[i - 1].id);
				break;
			}
		}

		return;
	}

	currentFolderId.set(id);
	unselectAll();
}

export function forward() {
	const historyArray = get(history);

	for (let i = 0; i < historyArray.length; i++) {
		if (historyArray[i].id === get(currentFolderId) && i + 1 !== historyArray.length) {
			currentFolderId.set(historyArray[i + 1].id);
			break;
		}
	}
	unselectAll();
}
