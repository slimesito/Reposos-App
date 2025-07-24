import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHeader } from '../context/HeaderContext';
import { Link } from 'react-router-dom';
import { Search, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';

// Hook de Debounce para no buscar en cada tecleo
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
};

const ManageRepososPage = () => {
    const { setHeader } = useHeader();
    const { getReposos } = useAuth();
    const [reposos, setReposos] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // --- FIX: La función ahora pide a la API la página y el término de búsqueda correctos ---
    const fetchReposos = useCallback(async (page, search) => {
        setLoading(true);
        setError('');
        const params = { page, ciudadano_id: search }; // Asumiendo que la API busca por 'ciudadano_id'
        const result = await getReposos(params);
        if (result.success) {
            setReposos(Array.isArray(result.data) ? result.data : []);
            setPagination(result.meta); // Guardamos la información de paginación
        } else {
            setError(result.message);
            setReposos([]);
        }
        setLoading(false);
    }, [getReposos]);

    useEffect(() => {
        setHeader({
            title: 'Gestión de Reposos',
            subtitle: 'Consulta y administra los reposos médicos del sistema.'
        });
    }, [setHeader]);

    // Este efecto se dispara cuando cambia la página o el término de búsqueda
    useEffect(() => {
        fetchReposos(currentPage, debouncedSearchTerm);
    }, [currentPage, debouncedSearchTerm, fetchReposos]);
    
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('es-VE', options);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por cédula..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Volver a la página 1 al buscar
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <Link to="/reposos/register" className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    <PlusCircle size={20} className="mr-2" />
                    Registrar Reposo
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b-2 border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="p-3 text-sm font-semibold tracking-wide">Cédula Ciudadano</th>
                            <th className="p-3 text-sm font-semibold tracking-wide hidden md:table-cell">Patología</th>
                            <th className="p-3 text-sm font-semibold tracking-wide hidden lg:table-cell">Especialidad</th>
                            <th className="p-3 text-sm font-semibold tracking-wide">Inicio</th>
                            <th className="p-3 text-sm font-semibold tracking-wide">Fin</th>
                            <th className="p-3 text-sm font-semibold tracking-wide hidden lg:table-cell">Emitido por</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center p-8 text-gray-500">Cargando reposos...</td></tr>
                        ) : error ? (
                            <tr><td colSpan="6" className="text-center p-8 text-red-500">{error}</td></tr>
                        ) : reposos.length > 0 ? (
                            reposos.map(reposo => (
                                <tr key={reposo.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-3 text-sm font-bold text-gray-800 dark:text-white">{reposo.ciudadano_id}</td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300 hidden md:table-cell">{reposo.pathology?.name || 'N/A'}</td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300 hidden lg:table-cell">{reposo.specialty?.name || 'N/A'}</td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{formatDate(reposo.start_date)}</td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{formatDate(reposo.end_date)}</td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300 hidden lg:table-cell">{reposo.creador?.name || 'N/A'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center p-8 text-gray-500 dark:text-gray-400">
                                    No se encontraron reposos que coincidan con la búsqueda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- FIX: La paginación ahora usa los datos del 'meta' object de la API --- */}
            {pagination && pagination.total > 0 && (
                <div className="flex justify-between items-center mt-6">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Mostrando {pagination.from} a {pagination.to} de {pagination.total} resultados
                    </span>
                    <div className="flex gap-2">
                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={pagination.current_page === 1} className="p-2 disabled:opacity-50"><ChevronLeft /></button>
                        <span className="p-2 font-semibold">{pagination.current_page}</span>
                        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.last_page))} disabled={pagination.current_page === pagination.last_page} className="p-2 disabled:opacity-50"><ChevronRight /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageRepososPage;
