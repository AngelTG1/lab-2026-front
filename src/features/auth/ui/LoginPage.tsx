import { useEffect } from 'react';
import { useLocation, useNavigate, type Location } from 'react-router-dom';
import { useAuth } from '../../../shared/hooks/useAuth';
import { LoginForm } from './LoginForm';

type LocationState = {
  from?: Location;
};

export function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fromState = (location.state as LocationState | null)?.from;
  const redirectTo = fromState?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  return (
    <div className="flex min-h-[calc(100vh-128px)] items-center justify-center px-4">
      <LoginForm
        loading={loading}
        onSubmit={async (values) => {
          await login(values);
          navigate(redirectTo, { replace: true });
        }}
      />
    </div>
  );
}
