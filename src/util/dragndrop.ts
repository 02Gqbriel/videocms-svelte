import { get, writable } from 'svelte/store';
import { updateFile, type Item, updateFolder } from './files';

export const dragging = writable<boolean>(false);

export const draggedItem = writable<Item>();

export const hoveredItemIndex = writable<number | undefined>();

export const contents = writable<
	HTMLElement & { children: HTMLCollectionOf<HTMLElement> }
>();

export function dragstart(ev: DragEvent, item: Item) {
	dragging.set(true);

	draggedItem.set(item);
}

export function drop(ev: DragEvent, item: Item) {
	ev.preventDefault();

	hoveredItemIndex.set(undefined);
	dragging.set(false);

	dragleave();

	const draggeditem = get(draggedItem);

	if (draggeditem && draggeditem !== item) {
		if (draggeditem.Type == 'File') {
			updateFile(draggeditem.ID, item.ID, draggeditem.Name);
		} else {
			updateFolder(draggeditem.ID, item.ID, draggeditem.Name);
		}
	}
}

export function dragenter(i: number, item: Item) {
	hoveredItemIndex.set(i);

	const el = get(contents).children[i];

	if (item.Type == 'File') {
		el.classList.add('not-allowed-item');
	} else {
		el.classList.add('active-item');
	}
}

export function dragleave() {
	const arr = [...get(contents).children];

	for (let j = 0; j < arr.length; j++) {
		if (j == get(hoveredItemIndex)) continue;

		arr[j].classList.remove('active-item');
		arr[j].classList.remove('not-allowed-item');
	}
}
