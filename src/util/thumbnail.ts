import { Database, LocalStorageDriver } from './localestorage';

export let blobStore = new Database(new LocalStorageDriver());
export let base64Store = new Database(new LocalStorageDriver());

export async function extractFrameFromVideo(file: File) {
	return new Promise<string>(async resolve => {
		const hash = await crypto.subtle.digest(
			'SHA-256',
			await file.arrayBuffer()
		);
		const sha256 = Array.from(new Uint8Array(hash))
			.map(b => b.toString(16).padStart(2, '0'))
			.join('');

		const result = base64Store.get<string>(sha256);

		if (result !== null) resolve(result);

		let videoObjectUrl = blobStore.get<string>(sha256);

		if (videoObjectUrl === null) {
			videoObjectUrl = URL.createObjectURL(file);

			blobStore.set(sha256, videoObjectUrl);
		}

		let video = document.createElement('video');

		let seekResolve;
		video.addEventListener('seeked', async function () {
			if (seekResolve) seekResolve();
		});

		video.src = videoObjectUrl;

		// workaround chromium metadata bug (https://stackoverflow.com/q/38062864/993683)
		while (
			(video.duration === Infinity || isNaN(video.duration)) &&
			video.readyState < 2
		) {
			await new Promise(r => setTimeout(r, 1000));
			video.currentTime = 10000000 * Math.random();
		}

		let canvas = document.createElement('canvas');
		let context = canvas.getContext('2d');
		let [w, h] = [video.videoWidth, video.videoHeight];

		canvas.width = w;
		canvas.height = h;

		video.currentTime = 0;
		await new Promise(r => (seekResolve = r));

		context.drawImage(video, 0, 0, w, h);
		let base64ImageData = canvas.toDataURL('image/jpeg', 0.05);

		base64Store.set(sha256, base64ImageData);

		resolve(base64ImageData);
	});
}
