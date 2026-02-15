import type { AuthSession } from '../domain/auth.entity';
import type { AuthRepository, LoginInput, RegisterInput } from '../domain/auth.repository';
import { API_BASE_URL } from '../../../shared/http/config';

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
        fullName: data.user.fullName,
        email: data.user.email ?? null,
        isAdmin: Boolean(data.user.isAdmin),
      },
    };
  }

  async register(input: RegisterInput): Promise<{ id: string; username: string; fullName: string; email?: string | null; isAdmin: boolean }> {
    const token = localStorage.getItem('lab-register-front.auth');
    const authData = token ? JSON.parse(token) : null;
    const bearerToken = authData?.state?.token;

    if (!bearerToken) {
      throw new Error('No autorizado. Debe iniciar sesión primero');
    }

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        username: input.username,
        fullName: input.fullName,
        email: input.email ?? null,
        password: input.password,
        isAdmin: input.isAdmin ?? false,
      }),
    });

    if (!response.ok) {
      let message = 'No se pudo registrar el usuario';
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
      id: data.id,
      username: data.username,
      fullName: data.fullName,
      email: data.email ?? null,
      isAdmin: Boolean(data.isAdmin),
    };
  }
}

export const authRepository = new HttpAuthRepository();
