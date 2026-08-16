import { CrimResponse, MastodonStatus, MastodonTag } from "@/types";

const dbName = "top-mastodon-posts";
const statusStoreName = "statuses";
const crimeStoreName = "crimes";
const dbVersion = 2;
const cacheTtlMs = 7 * 24 * 60 * 60 * 1000; // 1 week

export interface StatusCacheData {
	statuses: MastodonStatus[];
	hashtags: MastodonTag[];
}

interface StatusCacheEntry extends StatusCacheData {
	cachedAt: number;
}

interface CrimeCacheEntry {
	cachedAt: number;
	response: CrimResponse;
}

function statusCacheKey(server: string, username: string) {
	return `${server}:${username}`;
}

function crimeCacheKey(id: string, kind: "title" | "venue") {
	return `${id}:${kind}`;
}

function openDb(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(dbName, dbVersion);
		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains(statusStoreName)) {
				db.createObjectStore(statusStoreName);
			}
			if (!db.objectStoreNames.contains(crimeStoreName)) {
				db.createObjectStore(crimeStoreName);
			}
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

async function idbGet<T>(storeName: string, key: string): Promise<T | undefined> {
	const db = await openDb();
	try {
		return await new Promise<T | undefined>((resolve, reject) => {
			const request = db.transaction(storeName, "readonly").objectStore(storeName).get(key);
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	} finally {
		db.close();
	}
}

async function idbPut<T>(storeName: string, key: string, value: T): Promise<void> {
	const db = await openDb();
	try {
		await new Promise<void>((resolve, reject) => {
			const transaction = db.transaction(storeName, "readwrite");
			transaction.objectStore(storeName).put(value, key);
			transaction.oncomplete = () => resolve();
			transaction.onerror = () => reject(transaction.error);
		});
	} finally {
		db.close();
	}
}

async function idbDelete(storeName: string, key: string): Promise<void> {
	const db = await openDb();
	try {
		await new Promise<void>((resolve, reject) => {
			const transaction = db.transaction(storeName, "readwrite");
			transaction.objectStore(storeName).delete(key);
			transaction.oncomplete = () => resolve();
			transaction.onerror = () => reject(transaction.error);
		});
	} finally {
		db.close();
	}
}

function hasIndexedDb() {
	return typeof window !== "undefined" && "indexedDB" in window;
}

export async function readStatusCache(
	server: string,
	username: string
): Promise<StatusCacheData | undefined> {
	if (!hasIndexedDb()) return undefined;

	try {
		const entry = await idbGet<StatusCacheEntry>(statusStoreName, statusCacheKey(server, username));
		if (!entry) return undefined;

		if (Date.now() - entry.cachedAt > cacheTtlMs) {
			await clearStatusCache(server, username);
			return undefined;
		}

		return { statuses: entry.statuses, hashtags: entry.hashtags };
	} catch (err) {
		console.warn("Failed to read status cache", err);
		return undefined;
	}
}

export async function writeStatusCache(
	server: string,
	username: string,
	statuses: MastodonStatus[],
	hashtags: MastodonTag[]
) {
	if (!hasIndexedDb()) return;

	try {
		const entry: StatusCacheEntry = { cachedAt: Date.now(), statuses, hashtags };
		await idbPut(statusStoreName, statusCacheKey(server, username), entry);
	} catch (err) {
		console.warn("Failed to write status cache", err);
	}
}

export async function clearStatusCache(server: string, username: string) {
	if (!hasIndexedDb()) return;

	try {
		await idbDelete(statusStoreName, statusCacheKey(server, username));
	} catch (err) {
		console.warn("Failed to clear status cache", err);
	}
}

export async function readCrimeCache(
	id: string,
	kind: "title" | "venue"
): Promise<CrimResponse | undefined> {
	if (!hasIndexedDb()) return undefined;

	try {
		const entry = await idbGet<CrimeCacheEntry>(crimeStoreName, crimeCacheKey(id, kind));
		if (!entry) return undefined;

		if (Date.now() - entry.cachedAt > cacheTtlMs) {
			await idbDelete(crimeStoreName, crimeCacheKey(id, kind));
			return undefined;
		}

		return entry.response;
	} catch (err) {
		console.warn("Failed to read crime cache", err);
		return undefined;
	}
}

export async function writeCrimeCache(
	id: string,
	kind: "title" | "venue",
	response: CrimResponse
) {
	if (!hasIndexedDb()) return;

	try {
		const entry: CrimeCacheEntry = { cachedAt: Date.now(), response };
		await idbPut(crimeStoreName, crimeCacheKey(id, kind), entry);
	} catch (err) {
		console.warn("Failed to write crime cache", err);
	}
}
