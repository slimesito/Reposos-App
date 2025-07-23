import React, { useEffect } from 'react';
import { useHeader } from '../context/HeaderContext'; // 1. Importa el hook
import StatCard from '../components/ui/StatCard';
import { FileText, Users, BarChart3, Stethoscope } from 'lucide-react';

const DashboardPage = () => {
    const { setHeader } = useHeader(); // 2. Usa el hook

    // 3. Establece el encabezado cuando el componente se monta
    useEffect(() => {
        setHeader({
            title: 'Dashboard',
            subtitle: 'Aquí tienes un resumen de tu actividad reciente.'
        });
    }, [setHeader]);

    const stats = [
        // ... (el resto del componente no cambia)
        { title: "Reposos Hoy", value: "12", icon: <FileText className="text-white" size={24} />, color: "bg-blue-500" },
        { title: "Pacientes Activos", value: "156", icon: <Users className="text-white" size={24} />, color: "bg-green-500" },
        { title: "Reposos Pendientes", value: "3", icon: <BarChart3 className="text-white" size={24} />, color: "bg-yellow-500" },
        { title: "Total Reposos (Mes)", value: "289", icon: <Stethoscope className="text-white" size={24} />, color: "bg-purple-500" },
    ];
    
    const recentReposos = [
        { id: 'REP-001', patient: 'Carlos Rodriguez', date: '2025-07-23', days: 5, status: 'Activo' },
        { id: 'REP-002', patient: 'Ana Martínez', date: '2025-07-22', days: 3, status: 'Activo' },
        { id: 'REP-003', patient: 'Luis González', date: '2025-07-20', days: 7, status: 'Completado' },
        { id: 'REP-004', patient: 'María Fernández', date: '2025-07-19', days: 2, status: 'Completado' },
    ];

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map(stat => (
                    <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} colorClass={stat.color} />
                ))}
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Reposos Recientes</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="p-3 text-sm font-semibold tracking-wide">ID</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Paciente</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Fecha</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Días</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentReposos.map(reposo => (
                                <tr key={reposo.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{reposo.id}</td>
                                    <td className="p-3 text-sm font-bold text-gray-800 dark:text-white">{reposo.patient}</td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{reposo.date}</td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{reposo.days}</td>
                                    <td className="p-3 text-sm">
                                        <span className={`p-1.5 text-xs font-medium uppercase tracking-wider rounded-lg ${reposo.status === 'Activo' ? 'bg-green-200 text-green-800 dark:bg-green-800/50 dark:text-green-300' : 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200'}`}>
                                            {reposo.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
