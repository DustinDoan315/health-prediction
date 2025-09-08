import { ServiceRegistry } from './di';

export class AppInitializer {
  static initialize(): void {
    ServiceRegistry.registerServices();
  }
}
