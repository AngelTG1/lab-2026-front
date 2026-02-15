import { useState } from 'react';
import type { MonthlyStats } from '../../application/calculate-statistics.usecase';
import { IoFilter } from "react-icons/io5";
import { MdClose } from "react-icons/md";

interface MonthlyAccessChartProps {
    data: MonthlyStats[];
    title?: string;
    selectedYear?: number;
    onYearChange?: (year: number) => void;
    availableYears?: number[];
}

export function MonthlyAccessChart({ data, title = 'Accesos por Mes', selectedYear = 2026, onYearChange, availableYears = [] }: MonthlyAccessChartProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFilterClick = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleYearSelect = (year: number) => {
        onYearChange?.(year);
        setIsModalOpen(false);
    };
    // Encontrar el valor máximo para escalar las barras (solo entre los meses con datos)
    const maxValue = Math.max(
        ...data.filter(d => d.accesses > 0).map(d => d.accesses),
        ...data.filter(d => d.activeMachines > 0).map(d => d.activeMachines),
        1
    );

    // Calcular altura de las barras (máximo 200px)
    const barHeightMultiplier = 200 / maxValue;

    return (
        <div className="border border-lightGray rounded-lg p-2 bg-grayLight space-y-2">
            <div className='bg-white border border-lightGray rounded-lg p-4 w-full flex items-center justify-between'>
                <div>
                    <h4 className="text-sm font-normal text-slate-500 mb-1">Uso de este año:</h4>
                    <p className='text-2xl font-bold text-slate-900 mb-1'>{selectedYear}</p>
                </div>

                <div className="relative z-10">
                    <button 
                        onClick={handleFilterClick}
                        className='flex items-center cursor-pointer justify-center gap-2 border border-lightGray rounded-lg p-3 text-[#6A6A6A] hover:bg-gray-50 transition-colors'
                    >
                        <IoFilter size={20} />
                        <p className='font-medium'>Filter</p>
                    </button>

                    {/* Modal para seleccionar año - Aparece debajo del botón */}
                    {isModalOpen && (
                        <div className="absolute top-full right-0 mt-3 bg-grayLight rounded-lg p-3 w-80 shadow-lg border border-lightGray z-50">
                            <div className="flex items-center justify-between mb-2 bg-white w-full p-2.5 rounded-lg border border-lightGray">
                                <h3 className="text-2xl font-semibold text-slate-900">Años</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    <MdClose size={32} />
                                </button>
                            </div>

                            {availableYears.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2 bg-white p-4 rounded-lg border border-lightGray">
                                    {availableYears.map((year) => (
                                        <button
                                            key={year}
                                            onClick={() => handleYearSelect(year)}
                                            className={`py-2 px-3 rounded-lg font-semibold text-sm transition-colors ${
                                                selectedYear === year
                                                    ? 'bg-cyan-200 text-slate-900'
                                                    : 'bg-yellow-100 text-slate-900 hover:bg-yellow-200'
                                            }`}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-slate-500">No hay años disponibles</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-white border border-lightGray rounded-lg p-4">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                    <div className="flex gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-400 rounded"></div>
                            <span className="text-slate-600">Computadoras</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-cyan-200 rounded"></div>
                            <span className="text-slate-600">Accesos</span>
                        </div>
                    </div>
                </div>

                {data.length === 0 ? (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-slate-500">No hay datos disponibles</p>
                    </div>
                ) : data.every(d => d.accesses === 0 && d.activeMachines === 0) ? (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-slate-500">No hay datos disponibles</p>
                    </div>
                ) : (
                    <div className="flex items-end justify-around gap-2 h-64">
                        {data.map((month) => {
                            const hasAccessData = month.accesses > 0;
                            const hasMachineData = month.activeMachines > 0;

                            return (
                                <div
                                    key={month.month}
                                    className="flex flex-col items-center gap-2 flex-1"
                                >
                                    {/* Barras */}
                                    <div className="w-full flex flex-row items-end justify-center gap-1 h-48">
                                        {/* Barra de Máquinas Activas */}
                                        <div className="relative flex-1 flex flex-col items-center justify-end">
                                            <div
                                                className={`${hasMachineData ? 'bg-green-400' : 'bg-gray-300'} rounded-t-lg w-full transition-all duration-300 cursor-pointer`}
                                                style={{
                                                    height: `${hasMachineData ? Math.max(month.activeMachines * barHeightMultiplier, 5) : 10}px`,
                                                    minWidth: '20px'
                                                }}
                                                title={`${month.month}: ${month.activeMachines} máquinas`}
                                            />
                                        </div>
                                        
                                        {/* Barra de Accesos */}
                                        <div className="relative flex-1 flex flex-col items-center justify-end">
                                            <div
                                                className={`${hasAccessData ? 'bg-cyan-200 hover:bg-cyan-300' : 'bg-gray-300 hover:bg-gray-400'} rounded-t-lg w-full transition-all duration-300 cursor-pointer`}
                                                style={{
                                                    height: `${hasAccessData ? Math.max(month.accesses * barHeightMultiplier, 5) : 10}px`,
                                                    minWidth: '20px'
                                                }}
                                                title={`${month.month}: ${month.accesses} accesos`}
                                            />
                                        </div>
                                    </div>
                                   
                                    {/* Etiqueta del mes */}
                                    <p className="text-xs font-medium text-slate-600 text-center mt-2">
                                        {month.month}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
