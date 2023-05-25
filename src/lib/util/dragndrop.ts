import type { CreateMutateFunction } from '@tanstack/svelte-query';
import isEqual from 'lodash.isequal';
import type { IMoveFolderParams } from './files';
import toast from 'svelte-french-toast';
import { writable } from 'svelte/store';

export interface IDragItem {
	id: number;
	parentFolderId: number;
	name: string;
	type: 'Folder' | 'File';
}

let lastDragTarget: IDragItem;

export let draggedItem: IDragItem;

export const dragging = writable<boolean>(false);

export function dragstart(ev: DragEvent, item: IDragItem) {
	console.log('dragstart');

	draggedItem = item;
	dragging.set(true);
}

export function dragend(
	mutate: CreateMutateFunction<void, unknown, IMoveFolderParams, unknown> | null,
	targetIsOutside = false
) {
	dragging.set(false);

	if (targetIsOutside) return;

	if (isEqual(draggedItem, lastDragTarget) || lastDragTarget === undefined)
		return toast.error(`${draggedItem.type} cannot be moved into it self`);

	if (lastDragTarget.type === 'File')
		return toast.error(`${draggedItem.type} cannot be moved to a file`);

	if (mutate != null) {
		mutate({
			id: draggedItem.id,
			name: draggedItem.name,
			parentFolderId: lastDragTarget.id,
			type: draggedItem.type
		});
	}
}

export function dragover(item: IDragItem) {
	console.log('dragover');

	if (isEqual(item, lastDragTarget)) return;

	lastDragTarget = item;
}
