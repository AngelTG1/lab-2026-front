import type { User } from './user.entity';

export type CreateUserInput = {
  userName: string;
  password: string;
  email?: string;
};

export interface UsersRepository {
  findAll(): Promise<User[]>;
  createUser(input: CreateUserInput): Promise<User>;
}
