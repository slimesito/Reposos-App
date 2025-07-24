import React, { useEffect, useState } from 'react';
import { useHeader } from '../context/HeaderContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/ui/StatCard';
import { FileText, Users, Stethoscope, Activity, Loader2, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DashboardPage = () => {
    const { setHeader } = useHeader();
    const { getDashboardData } = useAuth();

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setHeader({
            title: 'Dashboard Principal',
            subtitle: 'Aquí tienes un resumen de la actividad reciente del sistema.'
        });

        const fetchData = async () => {
            setLoading(true);
            const result = await getDashboardData();
            if (result.success) {
                setDashboardData(result.data);
            } else {
                setError(result.message);
            }
            setLoading(false);
        };

        fetchData();
    }, [setHeader, getDashboardData]);

    const statsForCards = [
        { title: "Reposos Emitidos (Hoy)", value: dashboardData?.stats?.reposos_today ?? 0, icon: <FileText className="text-white" size={24} />, color: "bg-blue-500" },
        { title: "Total Pacientes", value: dashboardData?.stats?.total_patients ?? 0, icon: <Users className="text-white" size={24} />, color: "bg-green-500" },
        { title: "Médicos Activos", value: dashboardData?.stats?.active_doctors ?? 0, icon: <Stethoscope className="text-white" size={24} />, color: "bg-indigo-500" },
        { title: "Reposos Activos", value: dashboardData?.stats?.active_reposos ?? 0, icon: <Activity className="text-white" size={24} />, color: "bg-amber-500" },
    ];
    
    const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

    const CustomPieLegend = ({ payload }) => (
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
            {payload.map((entry, index) => (
                <li key={`item-${index}`} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
                    {entry.value} ({dashboardData?.specialtyData[index]?.value})
                </li>
            ))}
        </ul>
    );
    
    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 dark:text-red-400 p-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex flex-col items-center gap-4">
                <AlertTriangle size={40} />
                <h3 className="text-xl font-semibold">Error al Cargar el Dashboard</h3>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsForCards.map(stat => (
                    <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} colorClass={stat.color} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Reposos Emitidos por Mes</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={dashboardData?.monthlyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                                <XAxis dataKey="month" tick={{ fill: 'rgb(107 114 128)' }} />
                                <YAxis tick={{ fill: 'rgb(107 114 128)' }} />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: 'rgba(128, 128, 128, 0.5)', borderRadius: '0.5rem' }} />
                                <Legend />
                                <Bar dataKey="count" fill="#3b82f6" name="N° de Reposos" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Top 5 Especialidades</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={dashboardData?.specialtyData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name">
                                    {dashboardData?.specialtyData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: 'rgba(128, 128, 128, 0.5)', borderRadius: '0.5rem' }} />
                                <Legend content={<CustomPieLegend />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Últimos 5 Reposos Registrados</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b-2 border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="p-3 text-sm font-semibold tracking-wide">ID Reposo</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Paciente</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Fecha</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Días</th>
                                <th className="p-3 text-sm font-semibold tracking-wide">Emitido por</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData?.recentReposos.map(reposo => (
                                <tr key={reposo.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{reposo.id}</td>
                                    <td className="p-3 text-sm font-bold text-gray-800 dark:text-white">{reposo.patient}</td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{reposo.date}</td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{reposo.days}</td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{reposo.doctor}</td>
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
