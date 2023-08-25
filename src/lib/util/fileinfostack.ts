import { get, writable } from 'svelte/store';
import { getFileInfos, type FileInfos } from './files';

interface FileInfo {
	id: number;
	title: string;
	minimzed: boolean;
	loading: boolean;
	data?: FileInfos;
}

export const fileInfoStack = writable<Array<FileInfo>>([]);

export function pushFileInfo(fileinfo: FileInfo) {
	fileInfoStack.set([...get(fileInfoStack), fileinfo]);

	const { id } = fileinfo,
		index = get(fileInfoStack).length - 1;

	getFileInfos(id).then((v) => {
		const stack = get(fileInfoStack);

		if (stack[index].id == id) {
			stack[index].data = v;
			stack[index].loading = false;
		}
		console.log(get(fileInfoStack));

		fileInfoStack.set(stack);
	});
}

export function deleteFileInfo(id: number) {
	const stack = get(fileInfoStack);

	const index = stack.findIndex((v) => v.id === id);

	if (index !== -1) {
		stack.splice(index, 1);
	}

	fileInfoStack.set(stack);
}
