import { get, writable } from 'svelte/store';

interface SelectedItem {
	id: number;
	type: 'File' | 'Folder';
}

export const selected = writable<SelectedItem[]>([]);

export function selectItem(id: number, type: 'File' | 'Folder') {
	const currentSelected = get(selected);

	if (currentSelected.some(v => v.id === id && v.type === type)) return;

	selected.set([...currentSelected, { id, type }]);
}

export function unselectItem(id: number, type: 'File' | 'Folder') {
	selected.set([
		...get(selected).filter(v =>
			v.id === id && v.type === type ? undefined : v
		),
	]);
}
