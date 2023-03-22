import { get, writable } from 'svelte/store';
import { updateFile, type Item, updateFolder } from './files';

export const dragging = writable<boolean>(false);

export const draggedItem = writable<Item>();

export const contents = writable<
	HTMLElement & { children: HTMLCollectionOf<HTMLElement> }
>();

export function dragstart(ev: DragEvent, item: Item) {
	ev.dataTransfer.effectAllowed = 'link';

	dragging.set(true);

	draggedItem.set(item);
}

export function drop(ev: DragEvent, id: number, type: 'Folder' | 'File') {
	dragging.set(false);

	if (type === 'File' || id === -1) return;

	ev.preventDefault();

	const draggeditem = get(draggedItem);

	if (draggeditem && draggeditem.ID !== id && draggeditem.Type !== type) {
		if (draggeditem.Type == 'File') {
			updateFile(draggeditem.ID, id, draggeditem.Name);
		} else {
			updateFolder(draggeditem.ID, id, draggeditem.Name);
		}
	}
}

export function dragenter(ev: DragEvent) {
	ev.dataTransfer.dropEffect = 'link';
}
