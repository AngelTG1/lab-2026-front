import React from 'react';

export type TimePeriod = '7days' | '30days' | 'month' | 'week';

interface TimePeriodFilterProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

export function TimePeriodFilter({ selectedPeriod, onPeriodChange }: TimePeriodFilterProps) {
  const periods: { value: TimePeriod; label: string }[] = [
    { value: '7days', label: 'Últimos 7 días' },
    { value: '30days', label: 'Últimos 30 días' },
    { value: 'week', label: 'Esta semana' },
    { value: 'month', label: 'Este mes' },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onPeriodChange(period.value)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedPeriod === period.value
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
