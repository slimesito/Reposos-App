import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHeader } from '../context/HeaderContext';
import { Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

const ManagePatientsPage = () => {
    const { setHeader } = useHeader();
    const { getPatients } = useAuth();
    const [allPatients, setAllPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const patientsPerPage = 10;

    useEffect(() => {
        setHeader({
            title: 'Pacientes Registrados',
            subtitle: 'Consulta el historial de pacientes con reposos emitidos.'
        });
        
        const fetchPatients = async () => {
            setLoading(true);
            const result = await getPatients();
            if (result.success) {
                setAllPatients(Array.isArray(result.data) ? result.data : []);
            } else {
                setError(result.message);
                setAllPatients([]);
            }
            setLoading(false);
        };
        fetchPatients();
    }, [setHeader, getPatients]);

    // Lógica de filtrado y paginación del lado del cliente
    const filteredPatients = useMemo(() => {
        if (!searchTerm) return allPatients;
        return allPatients.filter(patient => 
            patient.ciudadano?.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.ciudadano?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allPatients, searchTerm]);

    const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
    const currentPatients = filteredPatients.slice(
        (currentPage - 1) * patientsPerPage,
        currentPage * patientsPerPage
    );

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por cédula o nombre..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b-2 border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="p-3 text-sm font-semibold tracking-wide">Cédula</th>
                            <th className="p-3 text-sm font-semibold tracking-wide">Nombre Completo</th>
                            <th className="p-3 text-sm font-semibold tracking-wide hidden md:table-cell">Último Hospital</th>
                            <th className="p-3 text-sm font-semibold tracking-wide">Total Reposos</th>
                            <th className="p-3 text-sm font-semibold tracking-wide">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center p-8 text-gray-500">Cargando pacientes...</td></tr>
                        ) : error ? (
                            <tr><td colSpan="5" className="text-center p-8 text-red-500">{error}</td></tr>
                        ) : currentPatients.length > 0 ? (
                            currentPatients.map(patient => (
                                <tr key={patient.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-3 text-sm font-bold text-gray-800 dark:text-white">{patient.ciudadano?.id || 'N/A'}</td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{patient.ciudadano?.name || 'No disponible'}</td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300 hidden md:table-cell">{patient.lastHospital?.name || 'N/A'}</td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{patient.reposos?.length || 0}</td>
                                    <td className="p-3 text-sm">
                                        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full" title="Ver historial (próximamente)">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center p-8 text-gray-500 dark:text-gray-400">
                                    No se encontraron pacientes.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {filteredPatients.length > 0 && totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Página {currentPage} de {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 disabled:opacity-50"><ChevronLeft /></button>
                        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 disabled:opacity-50"><ChevronRight /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePatientsPage;
