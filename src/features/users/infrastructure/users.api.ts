import { User } from '../domain/user.entity';
import type { CreateUserInput, UsersRepository } from '../domain/users.repository';
import { useAuthStore } from '../../../shared/store/auth.store';
import { API_BASE_URL } from '../../../shared/http/config';

class HttpUsersRepository implements UsersRepository {
  private mapApiUser(item: any): User {
    const desactivedRaw = item.desactivedAt ?? item.desactived_at ?? null;
    return new User({
      userId: item.userId ?? item.user_id,
      userName: item.userName ?? item.user_name,
      passwordHash: item.passwordHash ?? item.password ?? '',
      hashMethod: item.hashMethod ?? item.hash_method ?? 'bcrypt',
      email: item.email ?? null,
      name: item.name ?? item.name,
      apellidoPaterno: item.apellidoPaterno ?? item.apellido_paterno,
      apellidoMaterno: item.apellidoMaterno ?? item.apellido_materno,
      isActive: typeof item.isActive === 'boolean' ? item.isActive : item.is_active !== undefined ? Boolean(item.is_active) : true,
      desactivedAt: desactivedRaw ? new Date(desactivedRaw) : null,
      createdAt: item.createdAt ? new Date(item.createdAt) : item.created_at ? new Date(item.created_at) : undefined,
      updatedAt: item.updatedAt ? new Date(item.updatedAt) : item.updated_at ? new Date(item.updated_at) : undefined,
    });
  }

  async findAll(): Promise<User[]> {
    const token = useAuthStore.getState().token;
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      let message = 'No se pudo obtener la lista de usuarios';
      try {
        const errorBody = await response.json();
        if (errorBody?.message) message = errorBody.message;
      } catch {
        // ignore parse errors
      }
      throw new Error(message);
    }

    const data = await response.json();
    return (data as any[]).map(
      (item) => this.mapApiUser(item),
    );
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const token = useAuthStore.getState().token;
    const response = await fetch(`${API_BASE_URL}/users/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      let message = 'No se pudo crear el usuario';
      try {
        const errorBody = await response.json();
        if (errorBody?.message) message = errorBody.message;
      } catch {
        // ignore parse errors
      }
      throw new Error(message);
    }

    const data = await response.json();

    return this.mapApiUser({
      ...data,
      userName: data.userName ?? input.userName,
      name: data.name ?? input.name,
      apellidoPaterno: data.apellidoPaterno ?? input.apellidoPaterno,
      apellidoMaterno: data.apellidoMaterno ?? input.apellidoMaterno,
    });
  }

  async updateActivation(userId: number, isActive: boolean): Promise<User> {
    const token = useAuthStore.getState().token;
    const action = isActive ? 'activate' : 'deactivate';
    const response = await fetch(`${API_BASE_URL}/users/${userId}/${action}`, {
      method: 'PATCH',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      let message = isActive ? 'No se pudo activar el usuario' : 'No se pudo desactivar el usuario';
      try {
        const errorBody = await response.json();
        if (errorBody?.message) message = errorBody.message;
      } catch {
        // ignore parse errors
      }
      throw new Error(message);
    }

    const data = await response.json();
    return this.mapApiUser({
      ...data,
      userId,
      isActive,
    });
  }
}

export const usersRepository = new HttpUsersRepository();
