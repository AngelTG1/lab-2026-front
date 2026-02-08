import type { PginaLog } from '../../pginalog/domain/pginalog.entity';

export interface MachineStatistics {
  machine: string;
  totalAccess: number;
  uniqueUsers: Set<string>;
  lastAccess: Date;
  ip: string | null;
  host: string | null;
}

export interface DashboardStatistics {
  totalAccess: number;
  totalMachines: number;
  uniqueUsers: number;
  machineStats: MachineStatistics[];
}

export class CalculateStatisticsUsecase {
  execute(logs: PginaLog[], startDate: Date, endDate: Date): DashboardStatistics {
    // Filtrar logs por rango de fechas
    const filteredLogs = logs.filter((log) => {
      const logDate = new Date(log.timeStamp);
      return logDate >= startDate && logDate <= endDate;
    });

    if (filteredLogs.length === 0) {
      return {
        totalAccess: 0,
        totalMachines: 0,
        uniqueUsers: 0,
        machineStats: [],
      };
    }

    // Agrupar por máquina
    const machineMap = new Map<string, MachineStatistics>();

    filteredLogs.forEach((log) => {
      const machine = log.machine || 'Sin máquina especificada';

      if (!machineMap.has(machine)) {
        machineMap.set(machine, {
          machine,
          totalAccess: 0,
          uniqueUsers: new Set(),
          lastAccess: new Date(log.timeStamp),
          ip: log.ip,
          host: log.host,
        });
      }

      const stats = machineMap.get(machine)!;
      stats.totalAccess++;

      // Extraer nombre de usuario del mensaje si está disponible
      if (log.message) {
        const userMatch = log.message.match(/user[=:\s]+(\w+)/i);
        if (userMatch) {
          stats.uniqueUsers.add(userMatch[1]);
        }
      }

      // Actualizar último acceso
      const logDate = new Date(log.timeStamp);
      if (logDate > stats.lastAccess) {
        stats.lastAccess = logDate;
      }
    });

    // Convertir mapa a array y calcular el total de usuarios únicos
    const machineStats = Array.from(machineMap.values()).sort(
      (a, b) => b.totalAccess - a.totalAccess
    );

    const allUniqueUsers = new Set<string>();
    machineStats.forEach((stat) => {
      stat.uniqueUsers.forEach((user) => allUniqueUsers.add(user));
    });

    return {
      totalAccess: filteredLogs.length,
      totalMachines: machineStats.length,
      uniqueUsers: allUniqueUsers.size,
      machineStats,
    };
  }

  private getDateRange(period: '7days' | '30days' | 'month' | 'week'): { start: Date; end: Date } {
    const end = new Date();
    const start = new Date();

    switch (period) {
      case '7days':
        start.setDate(start.getDate() - 7);
        break;
      case '30days':
        start.setDate(start.getDate() - 30);
        break;
      case 'week':
        const dayOfWeek = start.getDay();
        start.setDate(start.getDate() - dayOfWeek);
        break;
      case 'month':
        start.setDate(1);
        break;
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }

  getDateRangeForPeriod(period: '7days' | '30days' | 'month' | 'week'): { start: Date; end: Date } {
    return this.getDateRange(period);
  }
}
