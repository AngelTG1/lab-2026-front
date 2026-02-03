import { useEffect, useState } from 'react';
import { GetPginaLogUsecase } from '../application/get-pginalog.usecase';
import { pginaLogRepository } from '../infrastructure/pginalog.api';
import type { PginaLog } from '../domain/pginalog.entity';

const getPginaLogUsecase = new GetPginaLogUsecase(pginaLogRepository);

const PAGE_SIZE = 25;

export function PginaLogTable() {
  const [entries, setEntries] = useState<PginaLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const fetchLogs = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await getPginaLogUsecase.execute();
      setEntries(data);
      setPage(0);
    } catch (err: any) {
      setError(err?.message || 'No se pudo cargar el log');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(entries.length / PAGE_SIZE) - 1);
    if (page > maxPage) setPage(maxPage);
  }, [entries.length, page]);

  const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));
  const visible = entries.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="text-lg font-semibold text-slate-900">Actividad pGina</h2>
        <button
          type="button"
          onClick={fetchLogs}
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
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Fecha</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Host</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">IP</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Máquina</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Mensaje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-slate-600">
                  Cargando actividad...
                </td>
              </tr>
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-slate-600">
                  No hay registros disponibles.
                </td>
              </tr>
            ) : visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-slate-600">
                  No hay registros en esta página.
                </td>
              </tr>
            ) : (
              visible.map((entry, idx) => (
                <tr key={`${entry.timeStamp.toISOString()}-${idx}`}>
                  <td className="px-4 py-3 text-slate-800">
                    {entry.timeStamp ? new Date(entry.timeStamp).toLocaleString() : '-'}
                  </td>
                  <td className="px-4 py-3 text-slate-800">{entry.host ?? '-'}</td>
                  <td className="px-4 py-3 text-slate-800">{entry.ip ?? '-'}</td>
                  <td className="px-4 py-3 text-slate-800">{entry.machine ?? '-'}</td>
                  <td className="px-4 py-3 text-slate-700">{entry.message ?? '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-700">
        <span>
          Página {page + 1} de {totalPages} • {entries.length} registros
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
