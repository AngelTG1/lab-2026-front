export type UserProps = {
  userId?: number;
  userName: string;
  passwordHash: string;
  hashMethod: string;
  email?: string | null;
  name: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  isActive?: boolean;
  desactivedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export class User {
  readonly userId?: number;
  userName: string;
  passwordHash: string;
  hashMethod: string;
  email?: string | null;
  name: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  isActive: boolean;
  desactivedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: UserProps) {
    this.userId = props.userId;
    this.userName = props.userName;
    this.passwordHash = props.passwordHash;
    this.hashMethod = props.hashMethod;
    this.email = props.email;
    this.name = props.name;
    this.apellidoPaterno = props.apellidoPaterno;
    this.apellidoMaterno = props.apellidoMaterno;
    this.isActive = props.isActive ?? true;
    this.desactivedAt = props.desactivedAt ?? null;
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
      name: this.name,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      isActive: this.isActive,
      desactivedAt: this.desactivedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
