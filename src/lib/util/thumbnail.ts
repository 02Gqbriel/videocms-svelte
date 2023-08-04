import { get, writable } from 'svelte/store';

const MAX_CONCURRENCY_LIMIT = Math.round(navigator.hardwareConcurrency / 2);
const IDLE_DELAY = 500 / ('deviceMemory' in navigator ? <number>navigator.deviceMemory : 1);

const qeue: ThumbnailFile[] = [];
let totalRunning = 0;

export const files = writable<ThumbnailFile[]>([]);

export interface ThumbnailFile {
	hash: string;
	file: File;
	url?: string;
	isPreviewAvailable: boolean;
}

let interval: number | null = null;

export async function add(file: File) {
	const thumbnailFile: ThumbnailFile = {
		hash: await hashFileMetadata(file),
		file: file,
		isPreviewAvailable: false
	};

	if (qeue.length > 0 && get(files).some((v) => v.hash === thumbnailFile.hash)) return;

	if (qeue.length === 0) startInterval();

	files.set([...get(files), thumbnailFile]);
	qeue.push(thumbnailFile);
}

export async function next() {
	totalRunning++;
	const current = qeue.shift();

	if (!current) return;

	const url = await extractFrameFromVideo(current.file);

	const filesArray = get(files);

	for (let i = 0; i < filesArray.length; i++) {
		if (filesArray[i].hash === current.hash) {
			filesArray[i] = { ...filesArray[i], url, isPreviewAvailable: true };

			files.set(filesArray);
		}
	}

	totalRunning--;

	if (qeue.length === 0) stopInterval();
}

function startInterval() {
	interval = setInterval(function () {
		if (totalRunning < MAX_CONCURRENCY_LIMIT && totalRunning < qeue.length) next();
	}, IDLE_DELAY);
}

function stopInterval() {
	clearInterval(interval ?? 0);
}

export async function extractFrameFromVideo(file: File): Promise<string> {
	const videoObjectUrl = URL.createObjectURL(file);

	const video = document.createElement('video');

	let seekResolve: (value: unknown) => void;
	video.addEventListener('seeked', async function () {
		if (seekResolve) seekResolve(undefined);
	});

	video.src = videoObjectUrl;

	// workaround chromium metadata bug (https://stackoverflow.com/q/38062864/993683)
	while ((video.duration === Infinity || isNaN(video.duration)) && video.readyState < 2) {
		await new Promise((r) => setTimeout(r, 1000));
		video.currentTime = 10000000 * Math.random();
	}

	const [w, h] = [video.videoWidth, video.videoHeight];
	const canvas = new OffscreenCanvas(w, h);
	const context = canvas.getContext('2d');

	canvas.width = w;
	canvas.height = h;

	video.currentTime = 0;
	await new Promise((r) => (seekResolve = r));

	if (context == null) throw new Error('Context Null');

	context.drawImage(video, 0, 0, w, h);

	const blob = await canvas.convertToBlob({ type: 'image/webp', quality: 0.05 });

	const base64ImageData = await blobToDataURL(blob);

	return base64ImageData;
}

async function blobToDataURL(blob: Blob) {
	const fileReader = new FileReader();

	return await new Promise<string>((r) => {
		fileReader.onload = () => {
			r(<string>fileReader.result);
		};

		fileReader.readAsDataURL(blob);
	});
}

export async function hashFile(file: File) {
	const hash = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
	return Array.from(new Uint8Array(hash))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

export async function hashFileMetadata(file: File) {
	const encoder = new TextEncoder();
	const hash = await crypto.subtle.digest(
		'SHA-256',
		encoder.encode(`${file.name}-${file.lastModified}-${file.size}-${file.type}`)
	);
	return Array.from(new Uint8Array(hash))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}
