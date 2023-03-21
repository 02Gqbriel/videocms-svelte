import { get, writable } from 'svelte/store';

interface SelectedItem {
	id: number;
	name: string;
	type: 'File' | 'Folder';
}

export const selected = writable<SelectedItem[]>([]);

export function selectItem(id: number, type: 'File' | 'Folder', name: string) {
	const currentSelected = get(selected);

	if (
		currentSelected.some(v => v.id === id && v.type === type && v.name === name)
	)
		return;

	selected.set([...currentSelected, { id, type, name }]);
}

export function unselectItem(
	id: number,
	type: 'File' | 'Folder',
	name: String
) {
	selected.set([
		...get(selected).filter(v =>
			v.id === id && v.type === type && v.name === name ? undefined : v
		),
	]);
}
