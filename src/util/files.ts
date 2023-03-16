import toast from 'svelte-french-toast';
import { get, writable } from 'svelte/store';
import { url } from '../stores';
import { token } from './auth';
import { currentFolderID } from './folderTraversing';
import { sha256 } from 'hash.js';

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

export const filesLoaded = writable<boolean>(false);

export const files = writable<Item[]>([]);

export async function refreshItems() {
	filesLoaded.set(false);
	files.set([...(await listFolders()), ...(await listFiles())]);
	filesLoaded.set(true);
}

export async function listFolders(): Promise<Item[]> {
	const res = await fetch(`${url}/api/folders?ParentFolderID=${get(currentFolderID)}`, {
		headers: {
			Authorization: 'Basic ' + get(token),
			'Access-Control-Allow-Headers': 'Authorization',
			'Access-Control-Allow-Credentials': 'true',
		},
	});

	if (res.ok) {
		const json = (await res.json()) as Item[];

		const items = json.map((v) => ({
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

	const res = await toast.promise(
		fetch(`${url}/api/folder`, {
			method: 'POST',
			headers: {
				Authorization: 'Basic ' + get(token),
				'Access-Control-Allow-Headers': 'Authorization',
				'Access-Control-Allow-Credentials': 'true',
			},
			body: formData,
		}),
		{
			loading: `Creating folder ${name}`,
			error: `Folder ${name} couldn't be created`,
			success: `Folder ${name} has been created successfully`,
		}
	);

	if (res.ok) {
		await refreshItems();
	}

	return res.ok;
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

	const res = await toast.promise(
		fetch(`${url}/api/file`, {
			method: 'PUT',
			headers: {
				Authorization: 'Basic ' + get(token),
				'Access-Control-Allow-Headers': 'Authorization',
				'Access-Control-Allow-Credentials': 'true',
			},
			body: formData,
		}),
		{
			loading: `Renamed folder to ${name}`,
			error: "Folder couldn't be renamed",
			success: `Folder renamed to ${name} successfully`,
		}
	);

	if (res.ok) {
		await refreshItems();
	}

	return res.ok;
}

export async function deleteFolder(fileID: number) {
	const formData = new FormData();

	formData.append('FolderID', fileID.toString());

	const res = await toast.promise(
		fetch(`${url}/api/folder`, {
			method: 'DELETE',
			headers: {
				Authorization: 'Basic ' + get(token),
				'Access-Control-Allow-Headers': 'Authorization',
				'Access-Control-Allow-Credentials': 'true',
			},
			body: formData,
		}),
		{
			success: `Folder has been deleted`,
			loading: 'Deleting folder',
			error: "Folder couldn't be deleted",
		}
	);

	if (res.ok) {
		await refreshItems();
	}
}

export async function listFiles(): Promise<Item[]> {
	const res = await fetch(`${url}/api/files?ParentFolderID=${get(currentFolderID)}`, {
		headers: {
			Authorization: 'Basic ' + get(token),
			'Access-Control-Allow-Headers': 'Authorization',
			'Access-Control-Allow-Credentials': 'true',
		},
	});

	if (res.ok) {
		const json = (await res.json()) as Item[];

		const items = json.map((v) => ({
			...v,
			Type: 'File' as 'Folder' | 'File',
		}));

		return items;
	}
}

export async function deleteFile(folderID: number) {
	const formData = new FormData();

	formData.append('LinkID', folderID.toString());

	const res = await toast.promise(
		fetch(`${url}/api/file`, {
			method: 'DELETE',
			headers: {
				Authorization: 'Basic ' + get(token),
				'Access-Control-Allow-Headers': 'Authorization',
				'Access-Control-Allow-Credentials': 'true',
			},
			body: formData,
		}),
		{
			success: `File has been deleted`,
			loading: 'Deleting file',
			error: "File couldn't be deleted",
		}
	);

	if (res.ok) {
		await refreshItems();
	}
}

export async function uploadFile(file: File): Promise<boolean> {
	let formData = new FormData();

	formData.append('Name', file.name);
	formData.append('Sha256', sha256().update(file).digest('hex'));
	formData.append('ParentFolderID', get(currentFolderID).toString());

	const exists = await fetch(`${url}/api/file/clone`, {
		method: 'POST',
		body: formData,
		headers: {
			Authorization: 'Basic ' + get(token),
			'Access-Control-Allow-Headers': 'Authorization',
			'Access-Control-Allow-Credentials': 'true',
		},
	});

	if (exists.ok) {
		toast.success(
			`File  ${
				file.name.length > 10 ? file.name.substring(0, 10) + '...' : file.name
			} has been uploaded`
		);

		return exists.ok;
	}

	formData = new FormData();

	formData.append('Name', file.name);
	formData.append('file', file);
	formData.append('ParentFolderID', get(currentFolderID).toString());

	const response = await toast.promise(
		fetch(`${url}/api/file`, {
			method: 'POST',
			body: formData,
			headers: {
				Authorization: 'Basic ' + get(token),
				'Access-Control-Allow-Headers': 'Authorization',
				'Access-Control-Allow-Credentials': 'true',
			},
		}),
		{
			success: `File  ${
				file.name.length > 10 ? file.name.substring(0, 10) + '...' : file.name
			} has been uploaded`,
			loading: 'Uploading file',
			error: `File  ${
				file.name.length > 10 ? file.name.substring(0, 10) + '...' : file.name
			} couldn't be uploaded`,
		}
	);

	return response.ok;
}
