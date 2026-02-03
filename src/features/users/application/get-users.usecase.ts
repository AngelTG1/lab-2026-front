import type { User } from '../domain/user.entity';
import type { UsersRepository } from '../domain/users.repository';

export class GetUsersUsecase {
  private readonly repository: UsersRepository;

  constructor(repository: UsersRepository) {
    this.repository = repository;
  }

  async execute(): Promise<User[]> {
    return this.repository.findAll();
  }
}
