export interface IUser {
  readonly id: number;
  readonly username: string;
  readonly email: string;
  readonly fullName: string;
  readonly isActive: boolean;
  readonly createdAt: Date;
}

export class User implements IUser {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly email: string,
    public readonly fullName: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date
  ) {}

  static fromApiResponse(data: any): User {
    return new User(
      data.id,
      data.username,
      data.email,
      data.full_name,
      data.is_active,
      new Date(data.created_at)
    );
  }

  toApiRequest(): any {
    return {
      username: this.username,
      email: this.email,
      full_name: this.fullName,
    };
  }
}
