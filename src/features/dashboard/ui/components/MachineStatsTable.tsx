import React from 'react';

interface MachineStats {
  machine: string;
  totalAccess: number;
  uniqueUsers: number;
  lastAccess: Date;
  ip: string | null;
  host: string | null;
}

interface MachineStatsTableProps {
  data: MachineStats[];
  loading?: boolean;
}

export function MachineStatsTable({ data, loading }: MachineStatsTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
        <p className="text-slate-500">Cargando estadísticas...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-slate-200 text-center">
        <p className="text-slate-500">Sin datos disponibles para este período</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-slate-200">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Computadora</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Host</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">IP</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Accesos</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Usuarios únicos</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Último acceso</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.machine}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{item.host || '-'}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{item.ip || '-'}</td>
              <td className="px-6 py-4 text-sm font-semibold text-blue-600">{item.totalAccess}</td>
              <td className="px-6 py-4 text-sm font-semibold text-green-600">{item.uniqueUsers}</td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {new Date(item.lastAccess).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
