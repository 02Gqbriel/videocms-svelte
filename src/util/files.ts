import toast from 'svelte-french-toast';
import { get, writable } from 'svelte/store';
import { url } from '../stores';
import { token } from './auth';
import { currentFolderID } from './folderTraversing';
import { closeFileInfo, type FileInfo } from './moreInfo';

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

function trimName(name: string) {
	return name.length > 10 ? name.substring(0, 10) + '...' : name;
}

export async function refreshItems() {
	filesLoaded.set(false);
	files.set([...(await listFolders()), ...(await listFiles())]);
	filesLoaded.set(true);
}

export async function listFolders(): Promise<Item[]> {
	const res = await fetch(
		`${url}/api/folders?ParentFolderID=${get(currentFolderID)}`,
		{
			headers: {
				Authorization: 'Basic ' + get(token),
				'Access-Control-Allow-Headers': 'Authorization',
				'Access-Control-Allow-Credentials': 'true',
			},
		}
	);

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
	const foldername = trimName(name);

	let loading = toast.loading(`Creating folder ${foldername}`);

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

	toast.remove(loading);

	if (res.ok) {
		await refreshItems();
		toast.success(`Folder ${foldername} has been created successfully`);
	} else {
		toast.error(`Folder ${foldername} couldn't be created`);
	}

	return res.ok;
}

export async function updateFolder(
	folderID: number,
	parentFolderID: number,
	name: string
) {
	closeFileInfo();

	let foldername = trimName(name);

	let loading = toast.loading(`Updating folder ${foldername}`);

	const formData = new FormData();

	formData.append('FolderID', folderID.toString());
	formData.append('ParentFolderID', parentFolderID.toString());
	formData.append('Name', name);

	const res = await fetch(`${url}/api/folder`, {
		method: 'PUT',
		headers: {
			Authorization: 'Basic ' + get(token),
			'Access-Control-Allow-Headers': 'Authorization',
			'Access-Control-Allow-Credentials': 'true',
		},
		body: formData,
	});

	toast.remove(loading);

	if (res.ok) {
		await refreshItems();
		toast.success(`Folder updated to ${foldername} successfully`);
	} else {
		toast.error(`Folder ${foldername} couldn't be updated`);
	}

	return res.ok;
}

export async function deleteFolder(
	fileID: number,
	name: string,
	multi: boolean = false
) {
	closeFileInfo();

	const foldername = trimName(name);

	let loading = !multi && toast.loading(`Deleting folder ${foldername}`);

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

	!multi && toast.remove(loading);

	if (!multi) {
		if (res.ok) {
			await refreshItems();
			toast.success(`Folder ${foldername} deleted successfully`);
		} else {
			toast.error(`Folder ${foldername} couldn't be deleted`);
		}
	}
}

export async function listFiles(): Promise<Item[]> {
	const res = await fetch(
		`${url}/api/files?ParentFolderID=${get(currentFolderID)}`,
		{
			headers: {
				Authorization: 'Basic ' + get(token),
				'Access-Control-Allow-Headers': 'Authorization',
				'Access-Control-Allow-Credentials': 'true',
			},
		}
	);

	if (res.ok) {
		const json = (await res.json()) as Item[];

		const items = json.map(v => ({
			...v,
			Type: 'File' as 'Folder' | 'File',
		}));

		return items;
	}
}

export async function getFile(linkID: number) {
	const res = await fetch(`${url}/api/file?LinkID=${linkID}`, {
		headers: {
			Authorization: 'Basic ' + get(token),
			'Access-Control-Allow-Headers': 'Authorization',
			'Access-Control-Allow-Credentials': 'true',
		},
	});

	if (res.ok) {
		const json = <FileInfo>await res.json();

		return json;
	}

	toast.error(`File information couldn't be retrieved`);

	return null;
}

export async function deleteFile(
	folderID: number,
	name: string,
	multi: boolean = false
) {
	closeFileInfo();

	const filename = trimName(name);

	let loading = !multi && toast.loading(`Deleting file ${filename}`);

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

	!multi && toast.remove(loading);

	if (!multi) {
		if (res.ok) {
			await refreshItems();
			toast.success(`File ${filename} has been deleted`);
		} else {
			toast.error(`File ${filename} couldn't be deleted`);
		}
	}
}

export async function uploadFile(file: File): Promise<boolean> {
	const filename = trimName(file.name);

	let loading = toast.loading(`Uploading file ${filename}`);

	let formData = new FormData();

	const hash = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
	const sha256 = Array.from(new Uint8Array(hash))
		.map(b => b.toString(16).padStart(2, '0'))
		.join('');

	formData.append('Name', file.name);
	formData.append('Sha256', sha256);
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
		toast.remove(loading);

		toast.success(`Existing File ${filename} has been copied`);

		return exists.ok;
	}

	formData = new FormData();

	formData.append('Name', file.name);
	formData.append('file', file);
	formData.append('ParentFolderID', get(currentFolderID).toString());

	const response = await fetch(`${url}/api/file`, {
		method: 'POST',
		body: formData,
		headers: {
			Authorization: 'Basic ' + get(token),
			'Access-Control-Allow-Headers': 'Authorization',
			'Access-Control-Allow-Credentials': 'true',
		},
	});

	toast.remove(loading);

	if (response.ok) {
		toast.success(`File ${filename} has been uploaded successfully`);
	} else {
		toast.error(`File ${filename} couldn't be uploaded`);
	}

	return response.ok;
}

export async function updateFile(
	linkID: number,
	parentFolderID: number,
	name: string
) {
	closeFileInfo();

	const filename = trimName(name);

	let loading = toast.loading(`Updating file ${filename}`);

	const formData = new FormData();

	formData.append('LinkID', linkID.toString());
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

	toast.remove(loading);

	if (res.ok) {
		await refreshItems();
		toast.success(`File ${filename} updated successfully`);
	} else {
		toast.error(`File ${filename} couldn't be updated`);
	}

	return res.ok;
}
