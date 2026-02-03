import type { AuthRepository, RegisterInput } from '../domain/auth.repository';

export class RegisterUsecase {
  private readonly repository: AuthRepository;

  constructor(repository: AuthRepository) {
    this.repository = repository;
  }

  async execute(input: RegisterInput): Promise<{ id: string; username: string; fullName: string; email?: string | null; isAdmin: boolean }> {
    return this.repository.register(input);
  }
}
