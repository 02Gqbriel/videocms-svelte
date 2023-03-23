import { writable } from 'svelte/store';

export interface FileInfo {
	CreatedAt: string;
	UpdatedAt: string;
	UUID: string;
	Name: string;
	ParentFolderID: number;
	Size: number;
	Duration: number;
	Qualitys: Qualitys[];
	Subtitles: Subtitles[] | null;
}

interface Qualitys {
	Name: string;
	Height: number;
	Width: number;
	AvgFrameRate: number;
	Ready: boolean;
	Failed: boolean;
	Progress: number;
}

interface Subtitles {
	Name: string;
	Lang: string;
	Ready: boolean;
}

export const currentFileInfo = writable<number>();

export const isFileInfoOpen = writable<boolean>(false);
