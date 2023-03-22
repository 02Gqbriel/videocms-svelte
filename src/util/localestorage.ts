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

export class Database {
	private storageDriver: StorageDriver;

	constructor(storageDriver: StorageDriver) {
		this.storageDriver = storageDriver;
	}

	get<T>(key: string): T | null {
		const data = this.storageDriver.getItem(key);

		return data ? <T>JSON.parse(data) : null;
	}

	set(key: string, value: any): void {
		const data = JSON.stringify(value);
		this.storageDriver.setItem(key, data);
	}

	remove(key: string): void {
		this.storageDriver.removeItem(key);
	}

	clear(): void {
		this.storageDriver.clear();
	}
}
