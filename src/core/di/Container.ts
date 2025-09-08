export interface IContainer {
  register<T>(key: string, factory: () => T): void;
  resolve<T>(key: string): T;
  isRegistered(key: string): boolean;
}

export class Container implements IContainer {
  private services = new Map<string, () => any>();
  private instances = new Map<string, any>();

  register<T>(key: string, factory: () => T): void {
    this.services.set(key, factory);
  }

  resolve<T>(key: string): T {
    if (this.instances.has(key)) {
      return this.instances.get(key);
    }

    const factory = this.services.get(key);
    if (!factory) {
      throw new Error(`Service ${key} is not registered`);
    }

    const instance = factory();
    this.instances.set(key, instance);
    return instance;
  }

  isRegistered(key: string): boolean {
    return this.services.has(key);
  }

  clear(): void {
    this.services.clear();
    this.instances.clear();
  }
}

export const container = new Container();
