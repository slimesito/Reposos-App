import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHeader } from '../context/HeaderContext';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Search, PlusCircle, ChevronLeft, ChevronRight, HeartPulse } from 'lucide-react';

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
};

const ManagePathologiesPage = () => {
    const { setHeader } = useHeader();
    const { getPathologies, deletePathology } = useAuth();
    const [pathologies, setPathologies] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const fetchPathologies = useCallback(async (page, search) => {
        setLoading(true);
        setError('');
        const params = { page, name: search };
        const result = await getPathologies(params);
        if (result.success) {
            setPathologies(result.data);
            setPagination(result.meta);
        } else {
            setError(result.message);
        }
        setLoading(false);
    }, [getPathologies]);

    useEffect(() => {
        setHeader({
            title: 'Gestionar Patologías',
            subtitle: 'Añade, edita y administra las patologías del sistema.'
        });
    }, [setHeader]);

    useEffect(() => {
        fetchPathologies(currentPage, debouncedSearchTerm);
    }, [currentPage, debouncedSearchTerm, fetchPathologies]);

    const handleDelete = async (pathologyId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta patología?')) {
            const result = await deletePathology(pathologyId);
            if (result.success) {
                fetchPathologies(currentPage, debouncedSearchTerm);
            } else {
                alert(`Error: ${result.message}`);
            }
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <Link to="/pathologies/add" className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    <PlusCircle size={20} className="mr-2" />
                    Añadir Patología
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b-2 border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="p-3 text-sm font-semibold tracking-wide">Nombre</th>
                            <th className="p-3 text-sm font-semibold tracking-wide hidden md:table-cell">Especialidad</th>
                            <th className="p-3 text-sm font-semibold tracking-wide">Días de Reposo</th>
                            <th className="p-3 text-sm font-semibold tracking-wide">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" className="text-center p-4">Cargando...</td></tr>
                        ) : error ? (
                            <tr><td colSpan="4" className="text-center p-4 text-red-500">{error}</td></tr>
                        ) : (
                            pathologies.map(pathology => (
                                <tr key={pathology.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-3 text-sm font-bold text-gray-800 dark:text-white">{pathology.name}</td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300 hidden md:table-cell">{pathology.specialty?.name || 'N/A'}</td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{pathology.days}</td>
                                    <td className="p-3 text-sm flex gap-2">
                                        <Link to={`/pathologies/edit/${pathology.id}`} state={{ pathology }} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full">
                                            <Pencil size={18} />
                                        </Link>
                                        <button onClick={() => handleDelete(pathology.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && pagination.total > 0 && (
                <div className="flex justify-between items-center mt-6">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Mostrando {pagination.from} a {pagination.to} de {pagination.total} resultados
                    </span>
                    <div className="flex gap-2">
                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={pagination.current_page === 1} className="p-2 disabled:opacity-50"><ChevronLeft /></button>
                        <span className="p-2">{pagination.current_page}</span>
                        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.last_page))} disabled={pagination.current_page === pagination.last_page} className="p-2 disabled:opacity-50"><ChevronRight /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePathologiesPage;
