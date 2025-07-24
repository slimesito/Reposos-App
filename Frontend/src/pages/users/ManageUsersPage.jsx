import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHeader } from '../../context/HeaderContext';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Search, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';

// Hook para debounce (retrasar la ejecución de una función)
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

const ManageUsersPage = () => {
    const { setHeader } = useHeader();
    // 1. Obtenemos el usuario actual del contexto de autenticación
    const { getUsers, deleteUser, user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ is_active: '' });
    const [currentPage, setCurrentPage] = useState(1);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const fetchUsers = useCallback(async (page, search, activeFilter) => {
        setLoading(true);
        setError('');
        const params = {
            page,
            name: search,
            is_active: activeFilter,
        };
        const result = await getUsers(params);
        if (result.success) {
            // 2. Filtramos la lista de usuarios para excluir al usuario actual
            const filteredData = result.data.filter(user => user.id !== currentUser.id);
            setUsers(filteredData);
            setPagination(result.meta);
        } else {
            setError(result.message);
        }
        setLoading(false);
    }, [getUsers, currentUser]); // 3. Añadimos currentUser a las dependencias

    useEffect(() => {
        setHeader({
            title: 'Gestionar Usuarios',
            subtitle: 'Busca, edita y administra los usuarios del sistema.'
        });
    }, [setHeader]);

    useEffect(() => {
        fetchUsers(currentPage, debouncedSearchTerm, filters.is_active);
    }, [currentPage, debouncedSearchTerm, filters.is_active, fetchUsers]);

    const handleFilterChange = (e) => {
        setCurrentPage(1);
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleDelete = async (userId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            const result = await deleteUser(userId);
            if (result.success) {
                fetchUsers(currentPage, debouncedSearchTerm, filters.is_active);
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
                <div className="flex items-center gap-4">
                    <select
                        name="is_active"
                        value={filters.is_active}
                        onChange={handleFilterChange}
                        className="border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Todos los estados</option>
                        <option value="1">Activo</option>
                        <option value="0">Inactivo</option>
                    </select>
                    <Link to="/users/register" className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                        <UserPlus size={20} className="mr-2" />
                        Registrar
                    </Link>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b-2 border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="p-3 text-sm font-semibold tracking-wide">Nombre</th>
                            <th className="p-3 text-sm font-semibold tracking-wide hidden md:table-cell">Email</th>
                            <th className="p-3 text-sm font-semibold tracking-wide hidden lg:table-cell">Especialidad</th>
                            <th className="p-3 text-sm font-semibold tracking-wide">Estado</th>
                            <th className="p-3 text-sm font-semibold tracking-wide">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center p-4">Cargando...</td></tr>
                        ) : error ? (
                            <tr><td colSpan="5" className="text-center p-4 text-red-500">{error}</td></tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="p-3 text-sm font-bold text-gray-800 dark:text-white">{user.name}</td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300 hidden md:table-cell">{user.email}</td>
                                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300 hidden lg:table-cell">{user.specialty || 'N/A'}</td>
                                    <td className="p-3 text-sm">
                                        <span className={`p-1.5 text-xs font-medium uppercase tracking-wider rounded-lg ${user.is_active ? 'bg-green-200 text-green-800 dark:bg-green-800/50 dark:text-green-300' : 'bg-red-200 text-red-800 dark:bg-red-800/50 dark:text-red-300'}`}>
                                            {user.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="p-3 text-sm flex gap-2">
                                        <Link to={`/users/edit/${user.id}`} state={{ user }} className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full">
                                            <Pencil size={18} />
                                        </Link>
                                        <button onClick={() => handleDelete(user.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
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
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={pagination.current_page === 1}
                            className="p-2 disabled:opacity-50"
                        >
                            <ChevronLeft />
                        </button>
                        <span className="p-2">{pagination.current_page}</span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.last_page))}
                            disabled={pagination.current_page === pagination.last_page}
                            className="p-2 disabled:opacity-50"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsersPage;
