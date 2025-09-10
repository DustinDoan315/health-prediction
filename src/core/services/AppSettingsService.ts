import { STORAGE_KEYS } from './StorageKeys';
import { storageService } from './StorageService';

export interface AppSettings {
  notifications: {
    healthReminders: boolean;
    predictionUpdates: boolean;
    weeklyReports: boolean;
  };
  privacy: {
    shareAnalytics: boolean;
    shareHealthData: boolean;
  };
  display: {
    units: 'metric' | 'imperial';
    language: string;
  };
}

const defaultSettings: AppSettings = {
  notifications: {
    healthReminders: true,
    predictionUpdates: true,
    weeklyReports: false,
  },
  privacy: {
    shareAnalytics: true,
    shareHealthData: false,
  },
  display: {
    units: 'metric',
    language: 'en',
  },
};

class AppSettingsService {
  async getSettings(): Promise<AppSettings> {
    const settings = await storageService.getObject<AppSettings>(STORAGE_KEYS.APP_SETTINGS);
    return settings || defaultSettings;
  }

  async updateSettings(settings: Partial<AppSettings>): Promise<void> {
    const currentSettings = await this.getSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    await storageService.setObject(STORAGE_KEYS.APP_SETTINGS, updatedSettings);
  }

  async resetSettings(): Promise<void> {
    await storageService.setObject(STORAGE_KEYS.APP_SETTINGS, defaultSettings);
  }

  async getNotificationSettings() {
    const settings = await this.getSettings();
    return settings.notifications;
  }

  async updateNotificationSettings(notifications: Partial<AppSettings['notifications']>): Promise<void> {
    const currentSettings = await this.getSettings();
    const updatedNotifications = { ...currentSettings.notifications, ...notifications };
    await this.updateSettings({ notifications: updatedNotifications });
  }

  async getPrivacySettings() {
    const settings = await this.getSettings();
    return settings.privacy;
  }

  async updatePrivacySettings(privacy: Partial<AppSettings['privacy']>): Promise<void> {
    const currentSettings = await this.getSettings();
    const updatedPrivacy = { ...currentSettings.privacy, ...privacy };
    await this.updateSettings({ privacy: updatedPrivacy });
  }

  async getDisplaySettings() {
    const settings = await this.getSettings();
    return settings.display;
  }

  async updateDisplaySettings(display: Partial<AppSettings['display']>): Promise<void> {
    const currentSettings = await this.getSettings();
    const updatedDisplay = { ...currentSettings.display, ...display };
    await this.updateSettings({ display: updatedDisplay });
  }
}

export const appSettingsService = new AppSettingsService();
