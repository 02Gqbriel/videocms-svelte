import toast from 'svelte-french-toast';
import { get, writable } from 'svelte/store';
import { url, token } from '../stores';

export interface Item {
	ID: number;
	CreatedAt: string;
	UpdatedAt: string;
	DeletedAt: string | null;
	Name: string;
	UserID: number;
	ParentFolderID: number;
	Type: 'Folder' | 'File';
	UUID?: string;
}

export const files = writable<Item[]>([]);

export async function refreshItems() {
	files.set([...(await listFolders()), ...(await listFiles())]);
}

export async function listFolders(): Promise<Item[]> {
	const res = await fetch(`${url}/api/folders`, {
		headers: {
			Authorization: 'Basic ' + get(token),
			'Access-Control-Allow-Headers': 'Authorization',
			'Access-Control-Allow-Credentials': 'true',
		},
	});

	if (res.ok) {
		const json = (await res.json()) as Item[];

		const items = json.map(v => ({
			...v,
			Type: 'Folder' as 'Folder' | 'File',
		}));

		return items;
	}
}

export async function createFolder(name: string, parentFolderID: number) {
	const formData = new FormData();

	formData.append('name', name);
	formData.append('ParentFolderID', parentFolderID.toString());

	const res = await fetch(`${url}/api/folder`, {
		method: 'POST',
		headers: {
			Authorization: 'Basic ' + get(token),
			'Access-Control-Allow-Headers': 'Authorization',
			'Access-Control-Allow-Credentials': 'true',
		},
		body: formData,
	});

	if (res.ok) {
		await refreshItems();

		toast.success(`Folder ${name} has been created succesfully`);
	}
}

export async function updateFolder(
	folderID: number,
	parentFolderID: number,
	name: string
) {
	const formData = new FormData();

	formData.append('FolderID', folderID.toString());
	formData.append('ParentFolderID', parentFolderID.toString());
	formData.append('Name', name);

	const res = await fetch(`${url}/api/file`, {
		method: 'PUT',
		headers: {
			Authorization: 'Basic ' + get(token),
			'Access-Control-Allow-Headers': 'Authorization',
			'Access-Control-Allow-Credentials': 'true',
		},
		body: formData,
	});

	if (res.ok) {
		await refreshItems();

		toast.success(`Renamed folder to ${name} succesfully`);
	}
}

export async function deleteFolder(fileID: number) {
	const formData = new FormData();

	formData.append('FolderID', fileID.toString());

	const res = await fetch(`${url}/api/folder`, {
		method: 'DELETE',
		headers: {
			Authorization: 'Basic ' + get(token),
			'Access-Control-Allow-Headers': 'Authorization',
			'Access-Control-Allow-Credentials': 'true',
		},
		body: formData,
	});

	if (res.ok) {
		await refreshItems();

		toast.success(`Folder has been deleted`);
	}
}

export async function listFiles(): Promise<Item[]> {
	const res = await fetch(`${url}/api/files`, {
		headers: {
			Authorization: 'Basic ' + get(token),
			'Access-Control-Allow-Headers': 'Authorization',
			'Access-Control-Allow-Credentials': 'true',
		},
	});

	if (res.ok) {
		const json = (await res.json()) as Item[];

		const items = json.map(v => ({
			...v,
			Type: 'File' as 'Folder' | 'File',
		}));

		return items;
	}
}

export async function deleteFile(folderID: number) {
	const formData = new FormData();

	formData.append('LinkID', folderID.toString());

	const res = await fetch(`${url}/api/file`, {
		method: 'DELETE',
		headers: {
			Authorization: 'Basic ' + get(token),
			'Access-Control-Allow-Headers': 'Authorization',
			'Access-Control-Allow-Credentials': 'true',
		},
		body: formData,
	});

	if (res.ok) {
		await refreshItems();

		toast.success(`File has been deleted`);
	}
}

export async function uploadFile(file: File): Promise<boolean> {
	const formData = new FormData();

	formData.append('Name', file.name);
	formData.append('file', file);

	const response = await fetch(`${url}/api/file`, {
		method: 'POST',
		body: formData,
		headers: {
			Authorization: 'Basic ' + get(token),
			'Access-Control-Allow-Headers': 'Authorization',
			'Access-Control-Allow-Credentials': 'true',
		},
	});

	if (response.ok) {
		await refreshItems();

		toast.success(
			`File ${
				file.name.length > 17 ? file.name.substring(0, 17) + '...' : file.name
			} has been uploaded succesfully`
		);
	}

	return response.ok;
}
