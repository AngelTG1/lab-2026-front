import { useAuthStore } from '../store/auth.store';

export const useAuth = () => {
  const { user, token, loading, hydrated, login, logout } = useAuthStore();
  return {
    user,
    token,
    loading,
    hydrated,
    isAuthenticated: Boolean(token && user),
    isAdmin: Boolean(user?.isAdmin),
    login,
    logout,
  };
};
