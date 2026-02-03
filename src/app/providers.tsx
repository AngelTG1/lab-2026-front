import { AuthProvider } from '../features/auth/ui/AuthProvider';
import { AppRouter } from './router';

export function Providers() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
