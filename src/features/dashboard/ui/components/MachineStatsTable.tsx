import { useState } from 'react';

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

const ROWS_PER_PAGE = 15;

export function MachineStatsTable({ data, loading }: MachineStatsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 border border-lightGray">
        <p className="text-slate-500">Cargando estadísticas...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 border border-lightGray text-center">
        <p className="text-slate-500">Sin datos disponibles para este período</p>
      </div>
    );
  }

  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = startIndex + ROWS_PER_PAGE;
  const paginatedData = data.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-lightGray">
      <table className="w-full">
        <thead className="bg-grayLight border-b border-lightGray">
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
          {paginatedData.map((item, index) => (
            <tr key={index} className="border-b border-lightGray hover:bg-grayLight transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.machine}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{item.host || '-'}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{item.ip || '-'}</td>
              <td className="px-6 py-4 text-sm font-semibold text-cyan-600">{item.totalAccess}</td>
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
      
      <div className="flex items-center justify-between px-6 py-4 bg-grayLight border-t border-lightGray">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded hover:bg-cyan-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          Regresar
        </button>
        
        <span className="text-sm font-medium text-slate-700">
          Página {currentPage} de {totalPages}
        </span>
        
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded hover:bg-cyan-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
