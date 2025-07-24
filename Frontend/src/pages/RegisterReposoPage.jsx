import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHeader } from '../context/HeaderContext';
import { useNavigate } from 'react-router-dom';
import { User, Stethoscope, HeartPulse, Calendar, FileText } from 'lucide-react';

const RegisterReposoPage = () => {
    const { setHeader } = useHeader();
    // --- FIX: Ya no necesitamos getHospitals aquí ---
    const { getSpecialties, getPathologies, addReposo } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        ciudadano_id: '',
        specialty_id: '',
        pathology_id: '',
        start_date: '',
        end_date: '',
        description: '',
        // --- FIX: Se elimina hospital_id del estado del formulario ---
        // hospital_id: '', 
    });

    const [specialties, setSpecialties] = useState([]);
    const [pathologies, setPathologies] = useState([]);
    // --- FIX: Ya no necesitamos el estado para los hospitales ---
    // const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setHeader({
            title: 'Registrar Nuevo Reposo',
            subtitle: 'Completa los datos para generar un nuevo reposo médico.'
        });
    }, [setHeader]);

    // Cargar datos para los selects (solo especialidades)
    useEffect(() => {
        const loadInitialData = async () => {
            const specialtiesRes = await getSpecialties();
            if (specialtiesRes.success) setSpecialties(specialtiesRes.data);
        };
        loadInitialData();
    }, [getSpecialties]);

    // Cargar patologías cuando cambia la especialidad seleccionada
    useEffect(() => {
        if (formData.specialty_id) {
            const loadPathologies = async () => {
                const pathologiesRes = await getPathologies({ specialty_id: formData.specialty_id });
                if (pathologiesRes.success) {
                    setPathologies(pathologiesRes.data);
                }
            };
            loadPathologies();
        } else {
            setPathologies([]);
        }
        setFormData(prev => ({ ...prev, pathology_id: '' }));
    }, [formData.specialty_id, getPathologies]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const result = await addReposo(formData);

        if (result.success) {
            setSuccess(result.message);
            setTimeout(() => {
                navigate('/reposos');
            }, 2000);
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md max-w-4xl mx-auto">
            {error && <div className="p-3 text-red-700 bg-red-100 dark:bg-red-900/30 rounded-lg">{error}</div>}
            {success && <div className="p-3 text-green-700 bg-green-100 dark:bg-green-900/30 rounded-lg">{success}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="ciudadano_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cédula del Ciudadano</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" name="ciudadano_id" id="ciudadano_id" value={formData.ciudadano_id} onChange={handleChange} required className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
                
                {/* --- FIX: Se elimina el select de Hospital --- */}

                <div>
                    <label htmlFor="specialty_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Especialidad</label>
                    <div className="relative">
                        <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <select name="specialty_id" id="specialty_id" value={formData.specialty_id} onChange={handleChange} required className="w-full appearance-none rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Seleccione una especialidad</option>
                            {Array.isArray(specialties) && specialties.map(spec => (<option key={spec.id} value={spec.id}>{spec.name}</option>))}
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="pathology_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patología</label>
                    <div className="relative">
                        <HeartPulse className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <select name="pathology_id" id="pathology_id" value={formData.pathology_id} onChange={handleChange} required disabled={!formData.specialty_id} className="w-full appearance-none rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
                            <option value="">Seleccione una patología</option>
                            {Array.isArray(pathologies) && pathologies.map(path => (<option key={path.id} value={path.id}>{path.name}</option>))}
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de Inicio</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="date" name="start_date" id="start_date" value={formData.start_date} onChange={handleChange} required className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
                <div>
                    <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha de Fin</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="date" name="end_date" id="end_date" value={formData.end_date} onChange={handleChange} required className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción (Opcional)</label>
                <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
                    <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="4" className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
            </div>

            <div className="flex justify-end">
                <button type="submit" disabled={loading} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50">
                    {loading ? 'Registrando...' : 'Registrar Reposo'}
                </button>
            </div>
        </form>
    );
};

export default RegisterReposoPage;
