import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  }

  async getItem(key: string): Promise<string | undefined> {
    const value = await AsyncStorage.getItem(key);
    return value || undefined;
  }

  async removeItem(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    await AsyncStorage.clear();
  }

  async setObject<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }

  async getObject<T>(key: string): Promise<T | undefined> {
    const value = await AsyncStorage.getItem(key);
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

  async setBoolean(key: string, value: boolean): Promise<void> {
    await AsyncStorage.setItem(key, value.toString());
  }

  async getBoolean(key: string): Promise<boolean | undefined> {
    const value = await AsyncStorage.getItem(key);
    if (value === null) return undefined;
    return value === 'true';
  }

  async setNumber(key: string, value: number): Promise<void> {
    await AsyncStorage.setItem(key, value.toString());
  }

  async getNumber(key: string): Promise<number | undefined> {
    const value = await AsyncStorage.getItem(key);
    if (value === null) return undefined;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
  }
}

export const storageService = new StorageService();
