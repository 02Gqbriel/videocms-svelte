import { writable } from 'svelte/store';

export const dragging = writable<boolean>(false);

export function dragndrop(node: HTMLElement) {
	node.ondrag;
}
