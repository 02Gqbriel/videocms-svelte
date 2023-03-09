export declare interface IWorkerConstructur {
	new (): IWorker;
}

export declare interface IWorker {
	previewVid(file: File): Promise<string>;
}

export declare interface InoteAndCent {
	note: string;
	cent: number;
}
