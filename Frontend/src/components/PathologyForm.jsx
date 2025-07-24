import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FileText, Stethoscope, Hash, ChevronDown } from 'lucide-react';

const PathologyForm = ({ pathologyToEdit }) => {
    const { addPathology, updatePathology, getSpecialties } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        specialty_id: '',
        days: 0,
    });
    const [specialties, setSpecialties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (pathologyToEdit) {
            setFormData({
                name: pathologyToEdit.name || '',
                specialty_id: pathologyToEdit.specialty?.id || '',
                days: pathologyToEdit.days || 0,
            });
        }
    }, [pathologyToEdit]);

    useEffect(() => {
        const loadSpecialties = async () => {
            const result = await getSpecialties();
            if (result.success) {
                setSpecialties(result.data);
            }
        };
        loadSpecialties();
    }, [getSpecialties]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const result = pathologyToEdit
            ? await updatePathology(pathologyToEdit.id, formData)
            : await addPathology(formData);

        if (result.success) {
            setSuccess(result.message);
            setTimeout(() => navigate('/pathologies'), 2000);
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md max-w-2xl mx-auto">
            {error && <div className="p-3 text-red-700 bg-red-100 rounded-lg">{error}</div>}
            {success && <div className="p-3 text-green-700 bg-green-100 rounded-lg">{success}</div>}
            
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de la Patología</label>
                <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                    <label htmlFor="specialty_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Especialidad</label>
                    <select name="specialty_id" id="specialty_id" value={formData.specialty_id} onChange={handleChange} required className="w-full appearance-none rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm py-3 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Seleccione una especialidad</option>
                        {Array.isArray(specialties) && specialties.map(spec => (
                            <option key={spec.id} value={spec.id}>{spec.name}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 top-7 flex items-center px-2 text-gray-400">
                        <ChevronDown size={20} className="ml-1" />
                    </div>
                </div>
                <div>
                    <label htmlFor="days" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Días de Reposo Sugeridos</label>
                    <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="number" name="days" id="days" value={formData.days} onChange={handleChange} required min="0" className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button type="submit" disabled={loading} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50">
                    {loading ? 'Guardando...' : (pathologyToEdit ? 'Actualizar Patología' : 'Añadir Patología')}
                </button>
            </div>
        </form>
    );
};

export default PathologyForm;
