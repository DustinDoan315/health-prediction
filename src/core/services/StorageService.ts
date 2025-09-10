import { MMKV } from 'react-native-mmkv';

class StorageService {
  private storage: MMKV;

  constructor() {
    this.storage = new MMKV({
      id: 'health-prediction-storage',
      encryptionKey: 'health-prediction-key-2024',
    });
  }

  setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }

  getItem(key: string): string | undefined {
    return this.storage.getString(key);
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clearAll();
  }

  setObject<T>(key: string, value: T): void {
    this.storage.set(key, JSON.stringify(value));
  }

  getObject<T>(key: string): T | undefined {
    const value = this.storage.getString(key);
    if (value) {
      try {
        return JSON.parse(value) as T;
      } catch (error) {
        console.error(`Error parsing stored object for key ${key}:`, error);
        return undefined;
      }
    }
    return undefined;
  }

  setBoolean(key: string, value: boolean): void {
    this.storage.set(key, value);
  }

  getBoolean(key: string): boolean | undefined {
    return this.storage.getBoolean(key);
  }

  setNumber(key: string, value: number): void {
    this.storage.set(key, value);
  }

  getNumber(key: string): number | undefined {
    return this.storage.getNumber(key);
  }
}

export const storageService = new StorageService();
