import type { User } from '../domain/user.entity';
import type { UsersRepository } from '../domain/users.repository';

export class UpdateUserActivationUsecase {
  private readonly repository: UsersRepository;

  constructor(repository: UsersRepository) {
    this.repository = repository;
  }

  async execute(userId: number, isActive: boolean): Promise<User> {
    return this.repository.updateActivation(userId, isActive);
  }
}
