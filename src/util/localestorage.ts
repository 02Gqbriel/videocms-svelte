interface StorageDriver {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
	removeItem(key: string): void;
	clear(): void;
}

export class LocalStorageDriver implements StorageDriver {
	private storage: Storage;

	constructor() {
		this.storage = window.localStorage;
	}

	getItem(key: string): string | null {
		return this.storage.getItem(key);
	}

	setItem(key: string, value: string): void {
		this.storage.setItem(key, value);
	}

	removeItem(key: string): void {
		this.storage.removeItem(key);
	}

	clear(): void {
		this.storage.clear();
	}
}
