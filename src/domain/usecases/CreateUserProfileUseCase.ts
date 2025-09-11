import { Gender, UserProfile } from '../entities';

export interface IUserProfileRepository {
  createProfile(profile: UserProfile): Promise<UserProfile>;
  getUserProfile(userId: number): Promise<UserProfile | null>;
  updateProfile(profile: UserProfile): Promise<UserProfile>;
  deleteProfile(profileId: string): Promise<void>;
}

export interface CreateUserProfileRequest {
  userId: number;
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  heightUnit?: 'cm' | 'ft';
  weightUnit?: 'kg' | 'lbs';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
}

export class CreateUserProfileUseCase {
  constructor(private readonly profileRepository: IUserProfileRepository) {}

  async execute(request: CreateUserProfileRequest): Promise<UserProfile> {
    const profile = UserProfile.create(
      request.userId,
      request.age,
      request.gender,
      request.height,
      request.weight,
      request.heightUnit,
      request.weightUnit,
      request.activityLevel
    );

    return await this.profileRepository.createProfile(profile);
  }
}
