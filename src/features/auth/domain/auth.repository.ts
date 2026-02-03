import type { AuthSession } from './auth.entity';

export type LoginInput = {
  username: string;
  password: string;
};

export type RegisterInput = {
  username: string;
  fullName: string;
  email?: string;
  password: string;
  isAdmin?: boolean;
};

export interface AuthRepository {
  login(input: LoginInput): Promise<AuthSession>;
  register(input: RegisterInput): Promise<{ id: string; username: string; fullName: string; email?: string | null; isAdmin: boolean }>;
}

