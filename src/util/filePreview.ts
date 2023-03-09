import * as Comlink from 'comlink';

import type { IWorkerConstructur } from '../@types';

export function getBase64(vid: File): Promise<string> {
	const reader = new FileReader();
	reader.readAsDataURL(vid);

	return new Promise<string>((resolve, reject) => {
		reader.onload = (e) => {
			resolve(reader.result as string);
		};
	});
}

const worker = new Worker(new URL('../sw/worker.ts?worker', import.meta.url), {
	type: 'module',
});

export const instance: Comlink.Remote<IWorkerConstructur> = Comlink.wrap(worker);
