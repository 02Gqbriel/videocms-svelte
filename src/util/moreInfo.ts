import { writable } from 'svelte/store';

export interface FileInfo {
	CreatedAt: string;
	UpdatedAt: string;
	Thumbnail: string;
	UUID: string;
	Name: string;
	ParentFolderID: number;
	Size: number;
	Duration: number;
	Qualitys: Qualitys[];
	Subtitles: Subtitles[] | null;
	Audios: Audios[] | null;
}

export interface Qualitys {
	Name: string;
	Height: number;
	Width: number;
	AvgFrameRate: number;
	Ready: boolean;
	Failed: boolean;
	Progress: number;
	Type: string;
	Size: number;
}

interface Subtitles {
	Name: string;
	Lang: string;
	Ready: boolean;
	Type: string;
}

interface Audios {
	Name: string;
	Lang: string;
	Ready: boolean;
	Type: string;
}

export const currentFileInfo = writable<number>();

export const isFileInfoOpen = writable<boolean>(false);

export function closeFileInfo() {
	isFileInfoOpen.set(false);
	currentFileInfo.set(undefined);
}
