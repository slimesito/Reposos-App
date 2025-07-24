import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

const SpecialtyForm = ({ specialtyToEdit }) => {
    const { addSpecialty, updateSpecialty } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (specialtyToEdit) {
            setName(specialtyToEdit.name || '');
        }
    }, [specialtyToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const specialtyData = { name };

        const result = specialtyToEdit
            ? await updateSpecialty(specialtyToEdit.id, specialtyData)
            : await addSpecialty(specialtyData);

        if (result.success) {
            setSuccess(result.message);
            setTimeout(() => navigate('/specialties'), 2000);
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de la Especialidad</label>
                <div className="relative">
                    <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>

            <div className="flex justify-end">
                <button type="submit" disabled={loading} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50">
                    {loading ? 'Guardando...' : (specialtyToEdit ? 'Actualizar Especialidad' : 'Añadir Especialidad')}
                </button>
            </div>
        </form>
    );
};

export default SpecialtyForm;
