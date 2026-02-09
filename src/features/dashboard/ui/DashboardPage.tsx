import { useEffect, useState } from 'react';
import { useAuth } from '../../../shared/hooks/useAuth';
import { pginaLogRepository } from '../../pginalog/infrastructure/pginalog.api';
import { GetPginaLogUsecase } from '../../pginalog/application/get-pginalog.usecase';
import { CalculateStatisticsUsecase, type DashboardStatistics, type MachineStatistics, type MonthlyStats } from '../application/calculate-statistics.usecase';
import type { TimePeriod } from './components/TimePeriodFilter';
import { TimePeriodFilter } from './components/TimePeriodFilter';
import { StatisticCard } from './components/StatisticCard';
import { MachineStatsTable } from './components/MachineStatsTable';
import { MonthlyAccessChart } from './components/MonthlyAccessChart';
import { HiOutlineComputerDesktop } from "react-icons/hi2";
import { IoAccessibilityOutline } from "react-icons/io5";
import { RiAdminLine } from "react-icons/ri";


export function DashboardPage() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('7days');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [statistics, setStatistics] = useState<DashboardStatistics>({
    totalAccess: 0,
    totalMachines: 0,
    uniqueUsers: 0,
    machineStats: [],
  });
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [machineStatsData, setMachineStatsData] = useState<Array<{
    machine: string;
    totalAccess: number;
    uniqueUsers: number;
    lastAccess: Date;
    ip: string | null;
    host: string | null;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndCalculateStatistics = async () => {
      try {
        setLoading(true);
        setError(null);

        const usecase = new GetPginaLogUsecase(pginaLogRepository);
        const logs = await usecase.execute();

        const statsUsecase = new CalculateStatisticsUsecase();
        const dateRange = statsUsecase.getDateRangeForPeriod(selectedPeriod);
        const stats = statsUsecase.execute(logs, dateRange.start, dateRange.end);

        setStatistics(stats);

        // Calcular estadísticas mensuales para el año seleccionado
        const monthly = statsUsecase.calculateMonthlyAccess(logs, selectedYear);
        setMonthlyStats(monthly);

        // Obtener años disponibles
        const years = statsUsecase.getAvailableYears(logs);
        setAvailableYears(years);

        // Preparar datos para la tabla
        const tableData = stats.machineStats.map((machine: MachineStatistics) => ({
          machine: machine.machine,
          totalAccess: machine.totalAccess,
          uniqueUsers: machine.uniqueUsers.size,
          lastAccess: machine.lastAccess,
          ip: machine.ip,
          host: machine.host,
        }));

        setMachineStatsData(tableData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar estadísticas');
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculateStatistics();
  }, [selectedPeriod, selectedYear]);

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">Panel de Control</h1>
        <p className="text-base text-slate-700">Bienvenido{user ? `, ${user.username}` : ''}.</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Filtrar por período</h2>
        <TimePeriodFilter selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatisticCard
          title="Total de Accesos"
          value={statistics.totalAccess}
          description={`En ${selectedPeriod === '7days' ? 'los últimos 7 días' : selectedPeriod === '30days' ? 'los últimos 30 días' : selectedPeriod === 'week' ? 'esta semana' : 'este mes'}`}
          icon={<IoAccessibilityOutline size={27} />}
        />
        <StatisticCard
          title="Computadoras Activas"
          value={statistics.totalMachines}
          description="Con registros en el período"
          icon={<HiOutlineComputerDesktop size={27} />}
        />
        <StatisticCard
          title="Usuarios Únicos"
          value={statistics.uniqueUsers}
          description="Diferentes usuarios detectados"
          icon={<RiAdminLine size={27} />}
        />
      </div>

      <div className="mb-8">
        <MonthlyAccessChart 
          data={monthlyStats} 
          title="Accesos por Mes"
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          availableYears={availableYears}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Estadísticas por Computadora</h2>
        <MachineStatsTable data={machineStatsData} loading={loading} />
      </div>
    </div>
  );
}
