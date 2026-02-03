import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AuthUser } from '../../features/auth/domain/auth.entity';
import { LoginUsecase } from '../../features/auth/application/login.usecase';
import { authRepository } from '../../features/auth/infrastructure/auth.api';
import type { LoginInput } from '../../features/auth/domain/auth.repository';

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  hydrated: boolean;
};

type AuthActions = {
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
  finishHydration: () => void;
};

const loginUsecase = new LoginUsecase(authRepository);
const AUTH_STORAGE_KEY = 'lab-register-front.auth';

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: true,
      hydrated: false,
      async login(input) {
        set({ loading: true });
        try {
          const session = await loginUsecase.execute(input);
          set({ user: session.user, token: session.token, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },
      logout() {
        set({ user: null, token: null, loading: false });
      },
      finishHydration() {
        set((state) => (state.hydrated ? state : { ...state, hydrated: true, loading: false }));
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        state?.finishHydration();
      },
    },
  ),
);
