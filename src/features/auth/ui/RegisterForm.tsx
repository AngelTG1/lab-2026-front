import { useState } from 'react';
import type { FormEvent } from 'react';

type RegisterFormProps = {
  onSubmit: (values: { username: string; fullName: string; email?: string; password: string; isAdmin?: boolean }) => Promise<void>;
  loading?: boolean;
};

export function RegisterForm({ onSubmit, loading = false }: RegisterFormProps) {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isFormValid = username.trim() && fullName.trim() && email.trim() && password && confirmPassword && isAdmin;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      await onSubmit({ username, fullName, email: email || undefined, password, isAdmin });
      setSuccess('Usuario registrado correctamente');
      setUsername('');
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsAdmin(false);
    } catch (err: any) {
      setError(err?.message || 'No se pudo registrar el usuario');
    }
  };

  return (
    <form
      className="w-full max-w-md space-y-4  "
      onSubmit={handleSubmit}
    >
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Registrar usuario</h2>
        <p className="mt-1 text-sm text-slate-600">Crea una nueva cuenta de administrador.</p>
      </div>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        <span>Usuario</span>
        <input
          type="text"
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-base text-slate-900 outline-none transition focus:border-[#006AE2] focus:bg-white focus:ring-2 focus:ring-[#006AE2]/60"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nombre de usuario"
          required
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        <span>Nombre completo</span>
        <input
          type="text"
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-base text-slate-900 outline-none transition focus:border-[#006AE2] focus:bg-white focus:ring-2 focus:ring-[#006AE2]/60"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Tu nombre completo"
          required
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        <span>Correo electrónico</span>
        <input
          type="email"
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-base text-slate-900 outline-none transition focus:border-[#006AE2] focus:bg-white focus:ring-2 focus:ring-[#006AE2]/60"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
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

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        <span>Confirmar contraseña</span>
        <input
          type="password"
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-base text-slate-900 outline-none transition focus:border-[#006AE2] focus:bg-white focus:ring-2 focus:ring-[#006AE2]/60"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </label>

      <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-[#006AE2]"
        />
        <span>Es administrador</span>
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-green-600">{success}</p> : null}

      <button
        type="submit"
        disabled={loading || !isFormValid}
        className="w-full rounded-xl bg-[#006AE2] px-4 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#005ac4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#006AE2] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? 'Registrando...' : 'Registrar usuario'}
      </button>
    </form>
  );
}
