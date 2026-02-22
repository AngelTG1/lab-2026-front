import { useState, useEffect } from 'react';
import type { User } from '../../domain/user.entity';

type UserTableProps = {
  users: User[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onToggleStatus: (user: User, nextActive: boolean) => void;
  updatingId: number | null;
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

export function UserTable({ users, loading, error, onRefresh, onToggleStatus, updatingId }: UserTableProps) {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const PAGE_SIZE = 10;

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(users.length / PAGE_SIZE) - 1);
    if (page > maxPage) setPage(maxPage);
  }, [users.length, page]);

  const filteredUsers = users.filter((user) => {
    const fullName = (user as any).fullName ?? user.userName ?? '';
    const email = user.email ?? '';
    const name = (user as any).name ?? '';
    const apellidoPaterno = (user as any).apellidoPaterno ?? '';
    const apellidoMaterno = (user as any).apellidoMaterno ?? '';
    const searchLower = searchTerm.toLowerCase();
    return (
      fullName.toLowerCase().includes(searchLower) ||
      email.toLowerCase().includes(searchLower) ||
      name.toLowerCase().includes(searchLower) ||
      apellidoPaterno.toLowerCase().includes(searchLower) ||
      apellidoMaterno.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const visibleUsers = filteredUsers.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="  ">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error ? <p className="px-4 py-3 text-sm text-red-600">{error}</p> : null}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-[#F9F9FB]">
            <tr>
              <th className="px-3 py-3 text-left font-medium text-[#6F6F6F]">ID</th>
              <th className="px-3 py-3 text-left font-medium text-[#6F6F6F]">Usuario</th>
              <th className="px-3 py-3 text-left font-medium text-[#6F6F6F]">Email</th>
              <th className="px-3 py-3 text-left font-medium text-[#6F6F6F]">Nombre</th>
              <th className="px-3 py-3 text-left font-medium text-[#6F6F6F]">Apellido Paterno</th>
              <th className="px-3 py-3 text-left font-medium text-[#6F6F6F]">Apellido Materno</th>
              <th className="px-3 py-3 text-left font-medium text-[#6F6F6F]">Estado</th>
              <th className="px-3 py-3 text-left font-medium text-[#6F6F6F]">Creado</th>
              <th className="px-3 py-3 text-right font-semibold text-slate-500">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-slate-600">
                  Cargando usuarios...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-slate-600">
                  No hay usuarios para mostrar.
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-slate-600">
                  No hay usuarios que coincidan con la búsqueda.
                </td>
              </tr>
            ) : visibleUsers.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-3 py-8 text-center text-slate-600">
                  No hay usuarios en esta página.
                </td>
              </tr>
            ) : (
              visibleUsers.map((user) => {
                const status = user.isActive ? 'Activo' : 'Inactivo';
                const statusColor = user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700';
                const toggleLabel = user.isActive ? 'Desactivar' : 'Activar';
                const canToggle = typeof user.userId === 'number';
                const isUpdating = updatingId === user.userId;
                return (
                  <tr key={user.userId ?? user.userName} className="hover:bg-slate-50">
                    <td className="px-3 py-4 text-slate-500 text-xs">{user.userId ?? '-'}</td>
                    <td className="px-3 py-4">
                      <div className="text-slate-900 font-medium">{(user as any).fullName ?? user.userName}</div>
                      <div className="text-slate-500 text-xs">{user.hashMethod}</div>
                    </td>
                    <td className="px-3 py-4 text-slate-700">{user.email ?? '-'}</td>
                    <td className="px-3 py-4 text-slate-700">{(user as any).name ?? '-'}</td>
                    <td className="px-3 py-4 text-slate-700">{(user as any).apellidoPaterno ?? '-'}</td>
                    <td className="px-3 py-4 text-slate-700">{(user as any).apellidoMaterno ?? '-'}</td>
                    <td className="px-3 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusColor}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-slate-600">{formatDate(user.createdAt)}</td>
                    <td className="px-3 py-4 text-right">
                      <div className="inline-flex items-center gap-2 justify-end">
                        <button
                          type="button"
                          disabled={!canToggle || isUpdating}
                          onClick={() => canToggle && onToggleStatus(user, !user.isActive)}
                          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isUpdating ? 'Guardando...' : toggleLabel}
                        </button>
                        <button
                          type="button"
                          onClick={() => console.log('view', user.userId ?? user.userName)}
                          className="rounded-md border border-blue-200 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50"
                        >
                          Ver
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
