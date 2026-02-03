export type UserProps = {
  userId?: number;
  userName: string;
  passwordHash: string;
  hashMethod: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class User {
  readonly userId?: number;
  userName: string;
  passwordHash: string;
  hashMethod: string;
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: UserProps) {
    this.userId = props.userId;
    this.userName = props.userName;
    this.passwordHash = props.passwordHash;
    this.hashMethod = props.hashMethod;
    this.email = props.email;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  toPrimitives() {
    return {
      userId: this.userId,
      userName: this.userName,
      passwordHash: this.passwordHash,
      hashMethod: this.hashMethod,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
