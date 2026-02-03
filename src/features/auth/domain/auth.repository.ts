import type { AuthSession } from './auth.entity';

export type LoginInput = {
  username: string;
  password: string;
};

export interface AuthRepository {
  login(input: LoginInput): Promise<AuthSession>;
}
