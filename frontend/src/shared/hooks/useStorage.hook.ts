export const StorageDataKey = {
	DASHBOARD_SORTED_TRADE: 'dashboard-sorted-trade',
	DASHBOARD_SORTED_KEEP: 'dashboard-sorted-keep',
}

export const useStorageHook = () => {
	// ✅ 공통 Setter
	const setStorage = (storage: Storage, key: string, value: unknown): void => {
		try {
			const data = typeof value === 'string' ? value : JSON.stringify(value);
			storage.setItem(key, data);
		} catch (error) {
			console.error(`[Storage:set] Error setting ${key}`, error);
		}
	};

	// ✅ 공통 Getter
	const getStorage = <T>(storage: Storage, key: string): T | null => {
		try {
			const item = storage.getItem(key);
			if (item === null) return null;
			try {
				return JSON.parse(item) as T;
			} catch {
				// JSON이 아니면 문자열 그대로 반환
				return item as unknown as T;
			}
		} catch (error) {
			console.error(`[Storage:get] Error getting ${key}`, error);
			return null;
		}
	};

	// ✅ 공통 Remover
	const removeStorage = (storage: Storage, key: string): void => {
		try {
			storage.removeItem(key);
		} catch (error) {
			console.error(`[Storage:remove] Error removing ${key}`, error);
		}
	};

	// ✅ 공통 Clear
	const clearAll = (storage: Storage): void => {
		try {
			storage.clear();
		} catch (error) {
			console.error(`[Storage:clear] Error clearing storage`, error);
		}
	};

	return {
		// 📌 로컬 스토리지
		setLocalStorage: (key: string, value: unknown) => setStorage(localStorage, key, value),
		getLocalStorage: <T>(key: string) => getStorage<T>(localStorage, key),
		removeLocalStorage: (key: string) => removeStorage(localStorage, key),
		clearLocalStorage: () => clearAll(localStorage),

		// 📌 세션 스토리지
		setSessionStorage: (key: string, value: unknown) => setStorage(sessionStorage, key, value),
		getSessionStorage: <T>(key: string) => getStorage<T>(sessionStorage, key),
		removeSessionStorage: (key: string) => removeStorage(sessionStorage, key),
		clearSessionStorage: () => clearAll(sessionStorage),

		// 📌 전체 클리어 (로컬 + 세션)
		clearStorage: () => {
			clearAll(localStorage);
			clearAll(sessionStorage);
		},
	};
};
