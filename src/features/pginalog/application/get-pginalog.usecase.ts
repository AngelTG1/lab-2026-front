import type { PginaLog } from '../domain/pginalog.entity';
import type { PginaLogRepository } from '../domain/pginalog.repository';

export class GetPginaLogUsecase {
  private readonly repository: PginaLogRepository;

  constructor(repository: PginaLogRepository) {
    this.repository = repository;
  }

  async execute(): Promise<PginaLog[]> {
    return this.repository.findAll();
  }
}
