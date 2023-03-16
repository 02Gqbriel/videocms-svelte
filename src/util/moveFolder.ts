import { toast } from 'svelte-french-toast';
import { get, writable } from 'svelte/store';
import throttle from 'raf-throttle';
import { updateFolder, type Item } from './files';

export const dragging = writable<boolean>(false);

export const target = writable;

export let draggedItem: { node: HTMLElement; item: Item };
export let targetItem: { node: HTMLElement; item: Item };

export function dragndrop(node: HTMLElement, item: Item) {
	node.draggable = item.Type == 'Folder';

	node.ondragstart = (ev) => dragstart(ev, node, item);

	node.onpointerup = () => pointerup(node, item);

	node.onpointerover = () => pointerover(node, item);

	node.onpointerout = (ev) => pointerout(ev, node);
}

function dragstart(ev: DragEvent, node: HTMLElement, item: Item) {
	if (item.Type === 'File') return toast.error("File can't be moved");

	dragging.set(true);

	draggedItem = { item, node };

	node.style.display = 'none';
}

async function pointerup(node: HTMLElement, item: Item) {
	if (!get(dragging)) return;

	if (item.Type === 'File') return toast.error("File can't be moved to file");

	targetItem = { item, node };

	await updateFolder(draggedItem.item.ID, item.ID, draggedItem.item.Name);
}

function pointerover(node: HTMLElement, item: Item) {
	if (!get(dragging)) return;

	targetItem = { item, node };

	node.style.cursor = item.Type !== 'Folder' ? 'not-allowed' : 'default';
}

function pointerout(ev: PointerEvent, node: HTMLElement) {
	if (!get(dragging)) return;

	node.style.cursor = 'default';
}

dragging.subscribe((v) => {
	if (v) {
		onpointermove = throttle((ev: PointerEvent) => {
			ev.preventDefault();
		});

		onpointerup = (ev) => {
			dragging.set(false);
			draggedItem.node.style.display = '';
		};
	} else {
		onpointermove = undefined;
		onpointerup = undefined;
	}
});
