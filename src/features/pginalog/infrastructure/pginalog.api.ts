import { PginaLog } from '../domain/pginalog.entity';
import type { PginaLogRepository } from '../domain/pginalog.repository';
import { useAuthStore } from '../../../shared/store/auth.store';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

class HttpPginaLogRepository implements PginaLogRepository {
  async findAll(): Promise<PginaLog[]> {
    const token = useAuthStore.getState().token;
    const response = await fetch(`${API_BASE_URL}/pginalog`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      let message = 'No se pudo obtener el log de pGina';
      try {
        const errorBody = await response.json();
        if (errorBody?.message) message = errorBody.message;
      } catch {
        // ignore parse error
      }
      throw new Error(message);
    }

    const data = await response.json();
    return (data as any[]).map((row) => PginaLog.fromRow(row)).filter((item): item is PginaLog => item !== null);
  }
}

export const pginaLogRepository = new HttpPginaLogRepository();
