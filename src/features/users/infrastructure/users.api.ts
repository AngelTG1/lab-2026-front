import { User } from '../domain/user.entity';
import type { CreateUserInput, UsersRepository } from '../domain/users.repository';
import { useAuthStore } from '../../../shared/store/auth.store';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

class HttpUsersRepository implements UsersRepository {
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
      (item) =>
        new User({
          userId: item.userId ?? item.user_id,
          userName: item.userName ?? item.user_name,
          passwordHash: item.passwordHash ?? item.password ?? '',
          hashMethod: item.hashMethod ?? item.hash_method ?? 'bcrypt',
          email: item.email ?? item.email,
          createdAt: item.createdAt ? new Date(item.createdAt) : item.created_at ? new Date(item.created_at) : undefined,
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : item.updated_at ? new Date(item.updated_at) : undefined,
        }),
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

    return new User({
      userId: data.userId,
      userName: data.userName ?? input.userName,
      passwordHash: data.passwordHash ?? '',
      hashMethod: data.hashMethod ?? 'bcrypt',
      email: data.email ?? undefined,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    });
  }
}

export const usersRepository = new HttpUsersRepository();
