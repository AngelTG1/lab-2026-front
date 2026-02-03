import { useState, useEffect } from 'react';
import type { User } from '../../domain/user.entity';

type UserTableProps = {
  users: User[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
};

export function UserTable({ users, loading, error, onRefresh }: UserTableProps) {
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 25;

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(users.length / PAGE_SIZE) - 1);
    if (page > maxPage) setPage(maxPage);
  }, [users.length, page]);

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const visibleUsers = users.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-slate-900">Usuarios</h2>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Recargar
        </button>
      </div>
      {error ? <p className="px-4 py-3 text-sm text-red-600">{error}</p> : null}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">ID</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Usuario</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Hash</th>
              <th className='px-4 py-3 text-left font-semibold text-slate-700'>Correo</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Creado</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Actualizado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-slate-600">
                  Cargando usuarios...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-slate-600">
                  No hay usuarios para mostrar.
                </td>
              </tr>
            ) : visibleUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-slate-600">
                  No hay usuarios en esta página.
                </td>
              </tr>
            ) : (
              visibleUsers.map((user) => (
                <tr key={user.userId ?? user.userName}>
                  <td className="px-4 py-3 text-slate-800">{user.userId ?? '-'}</td>
                  <td className="px-4 py-3 text-slate-800">{user.userName}</td>
                  <td className="px-4 py-3 text-slate-600">{user.hashMethod}</td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-700">
        <span>
          Página {page + 1} de {totalPages} • {users.length} usuarios
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Anterior
          </button>
          <button
            type="button"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
