import React from 'react';

interface StatisticCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
}

export function StatisticCard({ title, value, icon, description }: StatisticCardProps) {
  return (
    <div className="border border-lightGray rounded-lg p-3 bg-grayLight">
      <div className="flex items-center justify-between bg-white border-lightGray rounded-lg p-4">
        <div className=''>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
        </div>
       
        {icon && <div className="ml-4 border border-lightGray p-2.5 rounded-lg text-purple">{icon}</div>}
        
      </div>
    {description && <p className="text-slate-500 text-xs mt-1 px-3 py-1">{description}</p>}
    
    </div>
    
  );
}
