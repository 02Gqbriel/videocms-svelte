import { url } from '$lib/util/stores';
import { expires as expStore, token as tokenStore } from '$lib/util/auth';
import { get, writable } from 'svelte/store';
import toast from 'svelte-french-toast';
import { currentFolderId } from './traversing';

export interface FolderItem extends Item {
	Type: 'Folder';
}

export interface FileItem extends Item {
	Type: 'File';
	UUID: string;
}

export interface Item {
	ID: number;
	CreatedAt: string;
	UpdatedAt: string;
	DeletedAt: string | null;
	Name: string;
	UserID: number;
	ParentFolderID: number;
}

export interface FileInfos {
	CreatedAt: Date;
	UpdatedAt: Date;
	UUID: string;
	Name: string;
	Thumbnail: string;
	ParentFolderID: number;
	Size: number;
	Duration: number;
	Qualitys: Quality[];
	Subtitles: Audio[];
	Audios: Audio[];
}

export interface Audio {
	Name: string;
	Type: Type;
	Lang: string;
	Ready: boolean;
}

export type Type = 'hls' | 'ass' | 'vtt';

export interface Quality {
	Name: string;
	Type: string;
	Height: number;
	Width: number;
	AvgFrameRate: number;
	Ready: boolean;
	Failed: boolean;
	Progress: number;
	Size: number;
}

export const files = writable<(FileItem | FolderItem)[]>([]);

export async function getFileInfos(FileID: number) {
	const headers = {
		Authorization: 'Basic ' + get(tokenStore),
		'Access-Control-Allow-Credentials': 'true'
	};

	const res = await fetch(`${url}/api/file?LinkID=${FileID}`, {
		headers
	});

	if (!res.ok) {
		throw new Error(res.statusText);
	}

	return <FileInfos>await res.json();
}

export async function getFiles(ParentFolderID: number) {
	const headers = {
		Authorization: 'Basic ' + get(tokenStore),
		'Access-Control-Allow-Credentials': 'true'
	};

	const listFiles = async () => {
		const res = await fetch(`${url}/api/files?ParentFolderID=${ParentFolderID}`, {
			headers
		});

		if (!res.ok) {
			throw new Error(res.statusText);
		}

		const data = <Item[]>await res.json();

		return <FileItem[]>data.map((v) => ({ ...v, Type: 'File' }));
	};

	const listFolders = async () => {
		const res = await fetch(`${url}/api/folders?ParentFolderID=${ParentFolderID}`, {
			headers
		});

		if (!res.ok) {
			throw new Error(res.statusText);
		}

		const data = <Item[]>await res.json();

		return <FolderItem[]>data.map((v) => ({ ...v, Type: 'Folder' }));
	};

	const [foldersResult, filesResult] = await Promise.all([listFolders(), listFiles()]);

	return [...foldersResult, ...filesResult];
}

interface ICreateFileParams {
	file: File;
}

export async function createFile({ file }: ICreateFileParams): Promise<FileItem> {
	const filename = trimName(file.name);
	const token = get(tokenStore);
	const currentFolderID = get(currentFolderId).toString();

	const loading = toast.loading(`Uploading file ${filename}`);

	let formData = new FormData();

	const hash = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
	const sha256 = Array.from(new Uint8Array(hash))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');

	formData.append('Name', file.name);
	formData.append('Sha256', sha256);
	formData.append('ParentFolderID', get(currentFolderId).toString());

	const exists = await fetch(`${url}/api/file/clone`, {
		method: 'POST',
		body: formData,
		headers: {
			Authorization: 'Basic ' + token
		}
	});

	if (exists.ok) {
		const json = <FileItem>await exists.json();

		toast.remove(loading);

		toast.success(`Existing File ${filename} has been copied`);

		return json;
	}

	formData = new FormData();

	formData.append('Name', file.name);
	formData.append('file', file);
	formData.append('ParentFolderID', currentFolderID);

	const response = await fetch(`${url}/api/file`, {
		method: 'POST',
		body: formData,
		headers: {
			Authorization: 'Basic ' + token
		}
	});

	console.log(response);

	toast.remove(loading);

	if (response.ok) {
		const json = <FileItem>await response.json();

		toast.success(`File ${filename} has been uploaded successfully`);
		return json;
	} else {
		const text = await response.text();

		toast.error(`File ${filename} upload error: ${text}`);
		throw new Error(`File ${filename} couldn't be uploaded`);
	}
}

interface ICreateFolderParams {
	name: string;
	parentFolderID: number;
}

export async function createFolder({ name, parentFolderID }: ICreateFolderParams) {
	const foldername = trimName(name);
	const loading = toast.loading(`Creating folder ${foldername}`);
	const token = get(tokenStore);
	const formData = new FormData();

	formData.append('name', name);
	formData.append('ParentFolderID', parentFolderID.toString());

	const res = await fetch(`${url}/api/folder`, {
		method: 'POST',
		headers: {
			Authorization: 'Basic ' + token
		},
		body: formData
	});

	toast.remove(loading);

	if (res.ok) {
		const json = <FolderItem>await res.json();

		toast.success(`Folder ${foldername} has been created successfully`);

		return json;
	} else {
		toast.error(`Folder ${foldername} couldn't be created`);
		throw new Error(`Folder ${foldername} couldn't be created`);
	}
}

export interface IMoveFolderParams {
	id: number;
	parentFolderId: number;
	name: string;
	type: 'Folder' | 'File';
}

export async function moveFile({ id, parentFolderId, name, type }: IMoveFolderParams) {
	const trimmedName = trimName(name);
	const loading = toast.loading(`Moving ${type.toLowerCase()} ${trimmedName}`);
	const token = get(tokenStore);
	const formData = new FormData();

	formData.append(type == 'File' ? 'LinkID' : 'FolderID', String(id));
	formData.append('ParentFolderID', String(parentFolderId));
	formData.append('Name', name);

	const res = await fetch(`${url}/api/${type.toLowerCase()}`, {
		method: 'PUT',
		headers: {
			Authorization: 'Basic ' + token
		},
		body: formData
	});

	toast.remove(loading);

	if (res.ok) {
		toast.success(`${type} ${trimmedName} has been moved successfully`);
	} else {
		toast.error(`${type} ${trimmedName} couldn't be moved`);
		throw new Error(`${type} ${trimmedName} couldn't be moved`);
	}
}

interface IDeleteFileParams {
	id: number;
	type: 'Folder' | 'File';
}

export async function deleteFile({ id, type }: IDeleteFileParams) {
	const loading = toast.loading(`Deleting ${type}`);
	const formData = new FormData();
	const token = get(tokenStore);

	formData.append('LinkID', id.toString());

	const res = await fetch(`${url}/api/${type.toLowerCase()}`, {
		method: 'DELETE',
		headers: {
			Authorization: 'Basic ' + token
		},
		body: formData
	});

	toast.remove(loading);

	if (res.ok) {
		toast.success(`${type} has been deleted successfully`);
	} else {
		toast.error(`${type} couldn't be deleted`);
		throw new Error(`${type} couldn't be deleted`);
	}
}

interface IDeleteManyParams {
	items: number[];
	type: 'Folder' | 'File';
}

export async function deleteMany({ items, type }: IDeleteManyParams) {
	const loading = toast.loading(`Deleting ${items.length} ${type}s`);
	const token = get(tokenStore);

	const body = {
		[type == 'Folder' ? 'FolderIDs' : 'LinkIDs']: items.map((id) => ({
			[type == 'Folder' ? 'FolderID' : 'LinkID']: id
		}))
	};

	const res = await fetch(`${url}/api/${type.toLowerCase()}s`, {
		method: 'DELETE',
		headers: {
			Authorization: 'Basic ' + token,

			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	toast.remove(loading);

	if (res.ok) {
		toast.success(`${items.length} ${type}s has been deleted successfully`);
	} else {
		toast.error(`${items.length} ${type}s couldn't be deleted`);
		throw new Error(`${items.length} ${type}s couldn't be deleted`);
	}
}

function trimName(name: string) {
	return name.length > 10 ? name.substring(0, 10) + '...' : name;
}
