import { useState } from 'react';
import type { FormEvent } from 'react';

type CreateUserFormProps = {
  onSubmit: (values: { userName: string; email: string; password: string; name: string; apellidoPaterno: string; apellidoMaterno: string }) => Promise<void>;
  loading?: boolean;
};

export function CreateUserForm({ onSubmit, loading = false }: CreateUserFormProps) {
  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await onSubmit({ userName, email, password, name, apellidoPaterno, apellidoMaterno });
      setSuccess('Usuario creado correctamente');
      setUserName('');
      setEmail('');
      setName('');
      setApellidoPaterno('');
      setApellidoMaterno('');
      setPassword('');
    } catch (err: any) {
      setError(err?.message || 'No se pudo crear el usuario');
    }
  };

  return (
    <form className="w-full max-w-lg space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Crear usuario</h2>
        <p className="mt-1 text-sm text-slate-600">Solo admins pueden crear nuevos usuarios.</p>
      </div>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        <span>Usuario</span>
        <input
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/60"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="nuevo usuario"
          required
        />
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        <span>Nombre</span>
        <input
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/60"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre"
          required
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        <span>Apellido paterno</span>
        <input
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/60"
          type="text"
          value={apellidoPaterno}
          onChange={(e) => setApellidoPaterno(e.target.value)}
          placeholder="Apellido paterno"
          required
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        <span>Apellido materno</span>
        <input
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/60"
          type="text"
          value={apellidoMaterno}
          onChange={(e) => setApellidoMaterno(e.target.value)}
          placeholder="Apellido materno"
          required
        />
      </label>


      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        <span>Correo electrónico</span>
        <input
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/60"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          required
        />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        <span>Contraseña</span>
        <input
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-3 text-base text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/60"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-green-600">{success}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? 'Creando...' : 'Crear usuario'}
      </button>
    </form>
  );
}
