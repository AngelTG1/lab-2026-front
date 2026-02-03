import type { User } from '../domain/user.entity';
import type { CreateUserInput, UsersRepository } from '../domain/users.repository';

export class CreateUserUsecase {
  private readonly repository: UsersRepository;

  constructor(repository: UsersRepository) {
    this.repository = repository;
  }

  async execute(input: CreateUserInput): Promise<User> {
    return this.repository.createUser(input);
  }
}
