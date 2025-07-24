import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHeader } from '../../context/HeaderContext';
import { useNavigate } from 'react-router-dom';
import { User, Stethoscope, HeartPulse, Calendar, FileText, Search, CheckCircle, XCircle } from 'lucide-react';

const RegisterReposoPage = () => {
    const { setHeader } = useHeader();
    const { getSpecialties, getPathologies, addReposo, findCiudadanoByCedula } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        ciudadano_id: '', // Aquí guardaremos el ID numérico del ciudadano encontrado
        specialty_id: '',
        pathology_id: '',
        start_date: '',
        end_date: '',
        description: '',
    });

    // Estados para manejar la búsqueda del ciudadano
    const [cedulaInput, setCedulaInput] = useState('');
    const [foundCitizen, setFoundCitizen] = useState(null);
    const [searchStatus, setSearchStatus] = useState('idle'); // idle, loading, success, error
    const [searchMessage, setSearchMessage] = useState('');

    const [specialties, setSpecialties] = useState([]);
    const [pathologies, setPathologies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setHeader({
            title: 'Registrar Nuevo Reposo',
            subtitle: 'Completa los datos para generar un nuevo reposo médico.'
        });
    }, [setHeader]);

    useEffect(() => {
        const loadInitialData = async () => {
            const specialtiesRes = await getSpecialties();
            if (specialtiesRes.success) setSpecialties(specialtiesRes.data);
        };
        loadInitialData();
    }, [getSpecialties]);

    useEffect(() => {
        if (formData.specialty_id) {
            const loadPathologies = async () => {
                const pathologiesRes = await getPathologies({ specialty_id: formData.specialty_id });
                if (pathologiesRes.success) setPathologies(pathologiesRes.data);
            };
            loadPathologies();
        } else {
            setPathologies([]);
        }
        setFormData(prev => ({ ...prev, pathology_id: '' }));
    }, [formData.specialty_id, getPathologies]);

    const handleCedulaSearch = async () => {
        if (!cedulaInput) return;
        setSearchStatus('loading');
        setSearchMessage('');
        setFoundCitizen(null);

        const result = await findCiudadanoByCedula(cedulaInput);

        if (result.success) {
            setSearchStatus('success');
            setFoundCitizen(result.data);
            // --- FIX: Convertimos el ID a un string para que pase la validación de la API ---
            setFormData(prev => ({ ...prev, ciudadano_id: String(result.data.id) }));
            setSearchMessage(`Ciudadano encontrado: ${result.data.name}`);
        } else {
            setSearchStatus('error');
            setSearchMessage(result.message);
            setFormData(prev => ({ ...prev, ciudadano_id: '' })); // Limpiamos el ID
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.ciudadano_id) {
            setError('Debes buscar y confirmar un ciudadano antes de registrar el reposo.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');

        const result = await addReposo(formData);

        if (result.success) {
            setSuccess(result.message);
            setTimeout(() => navigate('/reposos'), 2000);
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md max-w-4xl mx-auto">
            {error && <div className="p-3 text-red-700 bg-red-100 dark:bg-red-900/30 rounded-lg">{error}</div>}
            {success && <div className="p-3 text-green-700 bg-green-100 dark:bg-green-900/30 rounded-lg">{success}</div>}

            {/* Campo de Búsqueda de Ciudadano */}
            <div>
                <label htmlFor="cedula_input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cédula del Ciudadano</label>
                <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            id="cedula_input"
                            value={cedulaInput} 
                            onChange={(e) => setCedulaInput(e.target.value)} 
                            required 
                            className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button type="button" onClick={handleCedulaSearch} disabled={searchStatus === 'loading'} className="flex items-center bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
                        <Search size={20} className="mr-2" />
                        Buscar
                    </button>
                </div>
                {searchMessage && (
                    <div className={`mt-2 text-sm flex items-center ${searchStatus === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {searchStatus === 'success' && <CheckCircle size={16} className="mr-2" />}
                        {searchStatus === 'error' && <XCircle size={16} className="mr-2" />}
                        {searchMessage}
                    </div>
                )}
            </div>

            {/* Resto del formulario (se activa cuando se encuentra un ciudadano) */}
            <fieldset disabled={!foundCitizen} className="space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </fieldset>

            <div className="flex justify-end">
                <button type="submit" disabled={loading || !foundCitizen} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50">
                    {loading ? 'Registrando...' : 'Registrar Reposo'}
                </button>
            </div>
        </form>
    );
};

export default RegisterReposoPage;
