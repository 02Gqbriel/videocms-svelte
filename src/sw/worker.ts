/// <reference lib="WebWorker" />

import * as Comlink from 'comlink';

declare interface IWorker {
	previewVid(file: File): Promise<string>;
}

function getBase64(vid: File): Promise<string> {
	const reader = new FileReader();
	reader.readAsDataURL(vid);

	return new Promise<string>((resolve, reject) => {
		reader.onload = (e) => {
			resolve(reader.result as string);
		};
	});
}

class Worker implements IWorker {
	async previewVid(file: File) {
		return await getBase64(file);
	}
}

Comlink.expose(Worker);
