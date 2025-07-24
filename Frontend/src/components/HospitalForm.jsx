import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Hospital, MapPin, ChevronDown } from 'lucide-react';

const HospitalForm = ({ hospitalToEdit }) => {
    const { addHospital, updateHospital, getCities } = useAuth();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        city_id: '',
    });
    
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // --- FIX ---
    // Se separa la lógica en dos useEffect para asegurar que el select se llene correctamente.

    // Paso 1: Llena los campos de texto simples tan pronto como llega el hospital a editar.
    useEffect(() => {
        if (hospitalToEdit) {
            setFormData(prev => ({
                ...prev,
                name: hospitalToEdit.name || '',
            }));
        }
    }, [hospitalToEdit]);

    // Paso 2: Este efecto se ejecuta cuando el hospital y la lista de ciudades están disponibles.
    // Busca la ciudad por nombre y establece el city_id correcto en el formulario.
    useEffect(() => {
        if (hospitalToEdit && cities.length > 0) {
            // Asumimos que hospitalToEdit.city es un objeto { id, name } o que hospitalToEdit.city_id existe.
            // La solución más robusta es buscar por el nombre si el ID no está directamente.
            const currentCity = cities.find(city => city.name === hospitalToEdit.city?.name);
            
            setFormData(prev => ({
                ...prev,
                // Usa el city_id directo si existe, si no, usa el ID encontrado por nombre.
                city_id: hospitalToEdit.city_id || (currentCity ? currentCity.id : ''),
            }));
        }
    }, [hospitalToEdit, cities]);


    // Carga la lista de ciudades al montar el componente.
    useEffect(() => {
        const loadCities = async () => {
            const result = await getCities();
            if (result.success) {
                setCities(result.data);
            }
        };
        loadCities();
    }, [getCities]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const result = hospitalToEdit
            ? await updateHospital(hospitalToEdit.id, formData)
            : await addHospital(formData);

        if (result.success) {
            setSuccess(result.message);
            setTimeout(() => navigate('/hospitals'), 2000);
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre del Hospital</label>
                <div className="relative">
                    <Hospital className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
            
            <div className="relative">
                <label htmlFor="city_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ciudad</label>
                <select 
                    name="city_id" 
                    id="city_id" 
                    value={formData.city_id} 
                    onChange={handleChange} 
                    required
                    className="w-full appearance-none rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm py-3 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Seleccione una ciudad</option>
                    {Array.isArray(cities) && cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 top-7 flex items-center px-2 text-gray-400">
                    <ChevronDown size={20} />
                </div>
            </div>

            <div className="flex justify-end">
                <button type="submit" disabled={loading} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50">
                    {loading ? 'Guardando...' : (hospitalToEdit ? 'Actualizar Hospital' : 'Añadir Hospital')}
                </button>
            </div>
        </form>
    );
};

export default HospitalForm;
