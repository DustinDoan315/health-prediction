import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../../domain/entities';
import { IUserProfileRepository } from '../../domain/usecases/CreateUserProfileUseCase';


const USER_PROFILE_KEY = 'user_profile';

export class LocalUserProfileRepository implements IUserProfileRepository {
  private async getStoredProfile(): Promise<UserProfile | null> {
    try {
      const stored = await AsyncStorage.getItem(USER_PROFILE_KEY);
      if (!stored) return null;
      
      const data = JSON.parse(stored);
      return new UserProfile(
        data.id,
        data.userId,
        data.age,
        data.gender,
        data.height,
        data.weight,
        data.heightUnit,
        data.weightUnit,
        data.activityLevel,
        data.healthConditions,
        data.medications,
        data.allergies,
        data.emergencyContact,
        new Date(data.createdAt),
        new Date(data.updatedAt)
      );
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  private async saveProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  }

  async createProfile(profile: UserProfile): Promise<UserProfile> {
    await this.saveProfile(profile);
    return profile;
  }

  async getUserProfile(userId: number): Promise<UserProfile | null> {
    const profile = await this.getStoredProfile();
    return profile && profile.userId === userId ? profile : null;
  }

  async updateProfile(updatedProfile: UserProfile): Promise<UserProfile> {
    await this.saveProfile(updatedProfile);
    return updatedProfile;
  }

  async deleteProfile(profileId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_PROFILE_KEY);
    } catch (error) {
      console.error('Error deleting user profile:', error);
      throw error;
    }
  }
}
