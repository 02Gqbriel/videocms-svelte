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
	console.log(id, type, get(draggedItem).ID, get(draggedItem).Type);

	dragging.set(false);

	if (type === 'File' || id === -1) return;

	ev.preventDefault();

	const draggeditem = get(draggedItem);

	if (draggeditem.Type === type ? draggeditem.ID !== id : true) {
		draggeditem.Type == 'File'
			? updateFile(draggeditem.ID, id, draggeditem.Name)
			: updateFolder(draggeditem.ID, id, draggeditem.Name);
	}
}

export function dragenter(ev: DragEvent) {
	ev.dataTransfer.dropEffect = 'link';
}
