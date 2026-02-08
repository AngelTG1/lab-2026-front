import React from 'react';

interface StatisticCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
}

export function StatisticCard({ title, value, icon, description }: StatisticCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          {description && <p className="text-slate-500 text-xs mt-1">{description}</p>}
        </div>
        {icon && <div className="text-blue-600">{icon}</div>}
      </div>
    </div>
  );
}
