export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

type HeightUnit = 'cm' | 'ft';
type WeightUnit = 'kg' | 'lbs';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export interface IUserProfile {
  readonly id: string;
  readonly userId: number;
  readonly age: number;
  readonly gender: Gender;
  readonly height: number;
  readonly weight: number;
  readonly heightUnit: HeightUnit;
  readonly weightUnit: WeightUnit;
  readonly activityLevel: ActivityLevel;
  readonly healthConditions: string[];
  readonly medications: string[];
  readonly allergies: string[];
  readonly emergencyContact: {
    readonly name: string;
    readonly phone: string;
    readonly relationship: string;
  };
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export class UserProfile implements IUserProfile {
  constructor(
    public readonly id: string,
    public readonly userId: number,
    public readonly age: number,
    public readonly gender: Gender,
    public readonly height: number,
    public readonly weight: number,
    public readonly heightUnit: HeightUnit,
    public readonly weightUnit: WeightUnit,
    public readonly activityLevel: ActivityLevel,
    public readonly healthConditions: string[],
    public readonly medications: string[],
    public readonly allergies: string[],
    public readonly emergencyContact: {
      readonly name: string;
      readonly phone: string;
      readonly relationship: string;
    },
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(
    userId: number,
    age: number,
    gender: Gender,
    height: number,
    weight: number,
    options: {
      heightUnit?: HeightUnit;
      weightUnit?: WeightUnit;
      activityLevel?: ActivityLevel;
    } = {}
  ): UserProfile {
    const { heightUnit = 'cm', weightUnit = 'kg', activityLevel = 'moderate' } = options;
    const now = new Date();
    return new UserProfile(
      `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      age,
      gender,
      height,
      weight,
      heightUnit,
      weightUnit,
      activityLevel,
      [],
      [],
      [],
      {
        name: '',
        phone: '',
        relationship: '',
      },
      now,
      now
    );
  }

  getBMI(): number {
    const heightInMeters = this.heightUnit === 'cm' ? this.height / 100 : this.height * 0.3048;
    const weightInKg = this.weightUnit === 'kg' ? this.weight : this.weight * 0.453592;
    return weightInKg / (heightInMeters * heightInMeters);
  }

  getBMICategory(): 'underweight' | 'normal' | 'overweight' | 'obese' {
    const bmi = this.getBMI();
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
  }

  convertHeight(toUnit: 'cm' | 'ft'): number {
    if (this.heightUnit === toUnit) return this.height;
    if (toUnit === 'cm') return this.height * 30.48;
    return this.height / 30.48;
  }

  convertWeight(toUnit: 'kg' | 'lbs'): number {
    if (this.weightUnit === toUnit) return this.weight;
    if (toUnit === 'kg') return this.weight * 0.453592;
    return this.weight / 0.453592;
  }

  updateProfile(updates: Partial<Omit<IUserProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): UserProfile {
    return new UserProfile(
      this.id,
      this.userId,
      updates.age ?? this.age,
      updates.gender ?? this.gender,
      updates.height ?? this.height,
      updates.weight ?? this.weight,
      updates.heightUnit ?? this.heightUnit,
      updates.weightUnit ?? this.weightUnit,
      updates.activityLevel ?? this.activityLevel,
      updates.healthConditions ?? this.healthConditions,
      updates.medications ?? this.medications,
      updates.allergies ?? this.allergies,
      updates.emergencyContact ?? this.emergencyContact,
      this.createdAt,
      new Date()
    );
  }

  toApiRequest(): any {
    return {
      user_id: this.userId,
      age: this.age,
      gender: this.gender,
      height: this.height,
      weight: this.weight,
      height_unit: this.heightUnit,
      weight_unit: this.weightUnit,
      activity_level: this.activityLevel,
      health_conditions: this.healthConditions,
      medications: this.medications,
      allergies: this.allergies,
      emergency_contact: this.emergencyContact,
    };
  }
}
