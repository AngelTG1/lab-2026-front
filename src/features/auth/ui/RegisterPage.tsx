import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterUsecase } from '../application/register.usecase';
import { authRepository } from '../infrastructure/auth.api';
import { RegisterForm } from './RegisterForm';
import { useAuth } from '../../../shared/hooks/useAuth';

const registerUsecase = new RegisterUsecase(authRepository);

export function RegisterPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Solo admins autenticados pueden registrar nuevos usuarios
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="flex min-h-[calc(100vh-128px)] items-center justify-center px-4">
        <div className="w-full max-w-md space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Acceso denegado</h2>
            <p className="mt-3 text-sm text-slate-600">
              Solo los administradores pueden registrar nuevos usuarios. Por favor, inicia sesión con una cuenta de administrador.
            </p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="w-full rounded-xl bg-[#006AE2] px-4 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#005ac4]"
          >
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex  px-4">
      <RegisterForm
        loading={loading}
        onSubmit={async (values) => {
          setLoading(true);
          try {
            await registerUsecase.execute(values);
          } catch (err: any) {
            throw err;
          } finally {
            setLoading(false);
          }
        }}
      />
    </div>
  );
}
