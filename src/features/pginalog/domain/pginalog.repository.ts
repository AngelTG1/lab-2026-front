import type { PginaLog } from './pginalog.entity';

export interface PginaLogRepository {
  findAll(): Promise<PginaLog[]>;
}
