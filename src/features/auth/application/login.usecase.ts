import type { AuthSession } from '../domain/auth.entity';
import type { AuthRepository, LoginInput } from '../domain/auth.repository';

export class LoginUsecase {
  private readonly repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  async execute(input: LoginInput): Promise<AuthSession> {
    return this.repository.login(input);
  }
}
