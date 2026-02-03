import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useAuthStore } from '../../../shared/store/auth.store';

export function AuthProvider({ children }: { children: ReactNode }) {
  // Ensure the store hydrates once at app start.
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);

  return <>{children}</>;
}
