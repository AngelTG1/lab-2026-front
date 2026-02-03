import { useState } from 'react';
import type { FormEvent } from 'react';

type LoginFormProps = {
  onSubmit: (values: { username: string; password: string }) => Promise<void>;
  loading?: boolean;
};

export function LoginForm({ onSubmit, loading = false }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      await onSubmit({ username, password });
    } catch (err: any) {
      setError(err?.message || 'No se pudo iniciar sesión');
    }
  };

  return (
    <form
      className="w-full max-w-md space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
      onSubmit={handleSubmit}
    >
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Iniciar sesión</h2>
        <p className="mt-1 text-sm text-slate-600">Accede con tu usuario y contraseña.</p>
      </div>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        <span>Usuario</span>
        <input
          type="text"
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-base text-slate-900 outline-none transition focus:border-[#006AE2] focus:bg-white focus:ring-2 focus:ring-[#006AE2]/60"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Usuario"
          required
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        <span>Contraseña</span>
        <input
          type="password"
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-base text-slate-900 outline-none transition focus:border-[#006AE2] focus:bg-white focus:ring-2 focus:ring-[#006AE2]/60"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </label>

      {error ? <p className="text-sm text-red-600">Ups... {error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-[#006AE2] px-4 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-[#015ac1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? 'Validando...' : 'Entrar'}
      </button>
    </form>
  );
}
