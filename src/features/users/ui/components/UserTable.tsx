import { useState, useEffect } from 'react';
import type { User } from '../../domain/user.entity';

type UserTableProps = {
  users: User[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
};

function formatDate(d?: Date | string) {
  if (!d) return '-';
  const date = new Date(d);
  try {
    const parts = date.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }).split(' ');
    const day = parts[0].replace('.', '');
    const month = parts[2] ? parts[2] : parts[1];
    const monthCap = month.charAt(0).toUpperCase() + month.slice(1);
    const year = parts[4] ?? parts[2] ?? date.getFullYear();
    return `${day}/${monthCap}/${year}`;
  } catch {
    return date.toLocaleDateString();
  }
}

export function UserTable({ users, loading, error, onRefresh }: UserTableProps) {
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(users.length / PAGE_SIZE) - 1);
    if (page > maxPage) setPage(maxPage);
  }, [users.length, page]);

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const visibleUsers = users.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="  ">
      

      {error ? <p className="px-4 py-3 text-sm text-red-600">{error}</p> : null}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-[#F9F9FB]">
            <tr>
              <th className="px-3 py-3 text-left font-medium text-[#6F6F6F]">ID</th>
              <th className="px-3 py-3 text-left font-medium text-[#6F6F6F]">Usuario</th>
              <th className="px-3 py-3 text-left font-medium text-[#6F6F6F]">Email</th>
              <th className="px-3 py-3 text-left font-medium text-[#6F6F6F]">Creado</th>
              {/* <th className="px-4 py-3 text-left font-semibold text-slate-500">Estatus</th> */}
              <th className="px-3 py-3 text-right font-semibold text-slate-500">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-slate-600">
                  Cargando usuarios...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-slate-600">
                  No hay usuarios para mostrar.
                </td>
              </tr>
            ) : visibleUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-slate-600">
                  No hay usuarios en esta página.
                </td>
              </tr>
            ) : (
              visibleUsers.map((user) => {
                const status = user.email ? 'Activo' : 'Pendiente';
                const statusColor = user.email ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700';
                return (
                  <tr key={user.userId ?? user.userName} className="hover:bg-slate-50">
                    <td className="px-3 py-4 text-slate-500 text-xs">{user.userId ?? '-'}</td>
                    <td className="px-3 py-4">
                      <div className="text-slate-900 font-medium">{(user as any).fullName ?? user.userName}</div>
                      <div className="text-slate-500 text-xs">{user.hashMethod}</div>
                    </td>
                    <td className="px-3 py-4 text-slate-700">{user.email ?? '-'}</td>
                    <td className="px-3 py-4 text-slate-600">{formatDate(user.createdAt)}</td>
                    {/* <td className="px-4 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusColor}`}>
                        {status}
                      </span>
                    </td> */}
                    <td className="px-3 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => console.log('view', user.userId ?? user.userName)}
                          className="rounded-md border border-blue-200 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50"
                        >
                          Actualizar
                        </button>
                        <button
                          type="button"
                          onClick={() => console.log('delete', user.userId ?? user.userName)}
                          className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-3 py-3 text-sm text-slate-700">
        <span className="text-xs border border-[#006AE2] py-1 px-3 rounded-sm text-[#006AE2] font-medium">
          Página {page + 1} de {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Regresar
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
