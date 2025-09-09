export enum AuthProvider {
  EMAIL_PASSWORD = 'email_password',
  GOOGLE = 'google',
  APPLE = 'apple',
}

export interface IUser {
  readonly id: number;
  readonly username: string;
  readonly email: string;
  readonly fullName: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly authProvider?: AuthProvider;
  readonly providerId?: string;
}

export class User implements IUser {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly email: string,
    public readonly fullName: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly authProvider: AuthProvider = AuthProvider.EMAIL_PASSWORD,
    public readonly providerId?: string
  ) {}

  static fromApiResponse(data: any): User {
    return new User(
      data.id,
      data.username,
      data.email,
      data.full_name,
      data.is_active,
      new Date(data.created_at),
      data.auth_provider || AuthProvider.EMAIL_PASSWORD,
      data.provider_id
    );
  }

  toApiRequest(): any {
    return {
      username: this.username,
      email: this.email,
      full_name: this.fullName,
      auth_provider: this.authProvider,
      provider_id: this.providerId,
    };
  }
}
