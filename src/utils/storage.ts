export function getLocalStorage<T>(key: string, initialValue: T): T {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
    } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        return initialValue;
    }
}

export function setLocalStorage<T>(key: string, value: T): void {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing localStorage key "${key}":`, error);
    }
}
