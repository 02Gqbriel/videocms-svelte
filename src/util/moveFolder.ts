import { toast } from 'svelte-french-toast';
import { get, writable } from 'svelte/store';
import { updateFolder, type Item } from './files';
import { currentFolderID, leaveFolder } from './folderTraversing';

export const dragging = writable<boolean>(false);

export let draggedItem: { node: HTMLElement; item: Item };
export let targetItem: { node: HTMLElement; item: Item };

export function dragndrop(node: HTMLElement, item: Item) {
	node.draggable = item.Type == 'Folder';

	node.ondragstart = ev => dragstart(ev, node, item);

	node.onpointerup = ev => pointerup(ev, node, item);

	node.onpointerover = () => pointerover(node, item);

	node.onpointerout = ev => pointerout(ev, node);
}

function dragstart(ev: DragEvent, node: HTMLElement, item: Item) {
	if (item.Type === 'File') return toast.error("File can't be moved");

	ev.preventDefault();

	dragging.set(true);

	draggedItem = { item, node };

	node.onpointerup = ev => pointerup(ev, node, item);
}

async function pointerup(ev: PointerEvent, node: HTMLElement, item: Item) {
	ev.preventDefault();

	if (!get(dragging)) return;

	if (item.Type === 'File') return toast.error("File can't be moved to file");

	if (draggedItem.node === node)
		return toast.error("File can't be moved to itself");

	targetItem = { item, node };

	await updateFolder(draggedItem.item.ID, item.ID, draggedItem.item.Name);

	node.
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

dragging.subscribe(v => {
	if (v) {
		onpointerup = async e => {
			e.preventDefault();
			e.stopImmediatePropagation();

			dragging.set(false);
			draggedItem.node.style.display = '';

			const target = e.target as HTMLElement;

			if (target.id == 'return' && get(currentFolderID) !== 0) {
				await leaveFolder();

				await updateFolder(
					draggedItem.item.ID,
					get(currentFolderID),
					draggedItem.item.Name
				);
			}
		};
	} else {
		onpointermove = undefined;
		onpointerup = undefined;
	}
});
