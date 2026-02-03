export type AuthProps = {
  id: string;
  username: string;
  fullName: string;
  email?: string | null;
  passwordHash: string;
  isAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type AuthUser = {
  id: string;
  username: string;
  fullName: string;
  email?: string | null;
  isAdmin: boolean;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

export class Auth {
  readonly id: string;
  username: string;
  fullName: string;
  email?: string | null;
  passwordHash: string;
  isAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: AuthProps) {
    this.id = props.id;
    this.username = props.username;
    this.fullName = props.fullName;
    this.email = props.email ?? null;
    this.passwordHash = props.passwordHash;
    this.isAdmin = props.isAdmin;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  toPrimitives() {
    return {
      id: this.id,
      username: this.username,
      fullName: this.fullName,
      email: this.email,
      passwordHash: this.passwordHash,
      isAdmin: this.isAdmin,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
