import { get, writable } from 'svelte/store';

interface ISelected {
	id: number;
	type: 'File' | 'Folder';
}

export const selected = writable<ISelected[]>([]);

export const isAllSelected = writable<boolean>(false);

export function selectItem(id: number, type: 'File' | 'Folder'): void {
	const selectedArray = get(selected);

	for (let i = 0; i < selectedArray.length; i++) {
		const item = selectedArray[i];

		if (item.id === id && item.type === type) {
			return;
		}
	}

	selected.set([...selectedArray, { id, type }]);
}

export function unselectItem(id: number, type: 'File' | 'Folder'): void {
	if (get(isAllSelected)) isAllSelected.set(false);

	const selectedArray = get(selected);

	for (let i = 0; i < selectedArray.length; i++) {
		const item = selectedArray[i];

		if (item.id === id && item.type === type) {
			selectedArray.splice(i, 1);
		}
	}

	selected.set(selectedArray);
}

export function unselectAll(): void {
	if (get(isAllSelected)) isAllSelected.set(false);

	selected.set([]);
}

export function isSelected(id: number, type: 'File' | 'Folder'): boolean {
	if (get(isAllSelected)) return true;

	const selectedArray = get(selected);

	for (let i = 0; i < selectedArray.length; i++) {
		const item = selectedArray[i];

		if (item.id === id && item.type === type) {
			return true;
		}
	}

	return false;
}
