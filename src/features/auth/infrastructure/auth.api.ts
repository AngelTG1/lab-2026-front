import type { AuthSession } from '../domain/auth.entity';
import type { AuthRepository, LoginInput } from '../domain/auth.repository';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

class HttpAuthRepository implements AuthRepository {
  async login(input: LoginInput): Promise<AuthSession> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      let message = 'No se pudo iniciar sesión';
      try {
        const errorBody = await response.json();
        if (errorBody?.message) message = errorBody.message;
      } catch {
        // ignore parse errors and use default message
      }
      throw new Error(message);
    }

    const data = await response.json();

    return {
      token: data.token,
      user: {
        id: data.user.id,
        username: data.user.username,
        email: data.user.email ?? null,
        isAdmin: Boolean(data.user.isAdmin),
      },
    };
  }
}

export const authRepository = new HttpAuthRepository();
