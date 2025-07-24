import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, User, Mail, Image as ImageIcon, X } from 'lucide-react';

const UserForm = ({ userToEdit }) => {
    const { registerUser, updateUser, getSpecialties, getHospitals } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        specialty_id: '',
        hospital_id: '',
        is_admin: false,
        is_active: true,
    });

    const [specialties, setSpecialties] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    
    const [files, setFiles] = useState({
        signature_image: null,
        stamp_image: null,
    });
    
    const [previews, setPreviews] = useState({
        signature_image: null,
        stamp_image: null,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (userToEdit) {
            setFormData({
                name: userToEdit.name || '',
                email: userToEdit.email || '',
                is_admin: userToEdit.is_admin || false,
                is_active: userToEdit.is_active ?? true,
            });
        }
    }, [userToEdit]);
    
    useEffect(() => {
        const loadSelectData = async () => {
            const specialtiesRes = await getSpecialties();
            if (specialtiesRes.success) setSpecialties(specialtiesRes.data);
            const hospitalsRes = await getHospitals();
            if (hospitalsRes.success) setHospitals(hospitalsRes.data);
        };
        loadSelectData();
    }, [getSpecialties, getHospitals]);

    useEffect(() => {
        if (userToEdit && specialties.length > 0 && hospitals.length > 0) {
            const currentSpecialty = specialties.find(spec => spec.name === userToEdit.specialty);
            const currentHospital = hospitals.find(hosp => hosp.name === userToEdit.hospital);
            setFormData(prev => ({
                ...prev,
                specialty_id: currentSpecialty ? currentSpecialty.id : '',
                hospital_id: currentHospital ? currentHospital.id : '',
            }));
        }
    }, [userToEdit, specialties, hospitals]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleFileChange = (e) => {
        const { name, files: inputFiles } = e.target;
        const file = inputFiles[0];
        if (file) {
            setFiles(prev => ({ ...prev, [name]: file }));
            setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const data = new FormData();
        
        // --- FIX ---
        // Se itera sobre el formData y se convierten los booleanos a 1 o 0.
        Object.keys(formData).forEach(key => {
            const value = formData[key];
            if (typeof value === 'boolean') {
                data.append(key, value ? '1' : '0');
            } else if (value !== null && value !== undefined) {
                data.append(key, value);
            }
        });

        for (const key in files) {
            if (files[key]) data.append(key, files[key]);
        }

        const result = userToEdit ? await updateUser(userToEdit.id, data) : await registerUser(data);

        if (result.success) {
            setSuccess(result.message);
            setTimeout(() => navigate('/users'), 2000);
        } else {
            setError(result.message);
        }
        setLoading(false);
    };
    
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        const storageBaseUrl = 'http://localhost:8000';
        if (imagePath.startsWith('/')) {
            imagePath = imagePath.substring(1);
        }
        return `${storageBaseUrl}/${imagePath}`;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
            {error && <div className="p-3 text-red-700 bg-red-100 rounded-lg">{error}</div>}
            {success && <div className="p-3 text-green-700 bg-green-100 rounded-lg">{success}</div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm py-3 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                </div>
                <div className="relative">
                    <label htmlFor="specialty_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Especialidad</label>
                    <select name="specialty_id" id="specialty_id" value={formData.specialty_id} onChange={handleChange} className="w-full appearance-none rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm py-3 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Seleccione una especialidad</option>
                        {Array.isArray(specialties) && specialties.map(spec => (<option key={spec.id} value={spec.id}>{spec.name}</option>))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 top-7 flex items-center px-2 text-gray-400"><ChevronDown size={20} /></div>
                </div>
                <div className="relative">
                    <label htmlFor="hospital_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hospital</label>
                    <select name="hospital_id" id="hospital_id" value={formData.hospital_id} onChange={handleChange} className="w-full appearance-none rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 shadow-sm py-3 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Seleccione un hospital</option>
                        {Array.isArray(hospitals) && hospitals.map(hosp => (<option key={hosp.id} value={hosp.id}>{hosp.name}</option>))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 top-7 flex items-center px-2 text-gray-400"><ChevronDown size={20} /></div>
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Imágenes del Usuario</h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label htmlFor="signature_image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Imagen de Firma</label>
                        <input type="file" name="signature_image" id="signature_image" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-gray-600 file:text-blue-700 dark:file:text-gray-200 hover:file:bg-blue-100 dark:hover:file:bg-gray-500"/>
                        {(previews.signature_image || userToEdit?.signature_image) && (
                            <div className="mt-4 p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg inline-block">
                                <img src={previews.signature_image || getImageUrl(userToEdit.signature_image)} alt="Vista previa de la firma" className="w-full h-32 object-contain" />
                            </div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="stamp_image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Imagen de Sello</label>
                        <input type="file" name="stamp_image" id="stamp_image" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 dark:file:bg-gray-600 file:text-blue-700 dark:file:text-gray-200 hover:file:bg-blue-100 dark:hover:file:bg-gray-500"/>
                        {(previews.stamp_image || userToEdit?.stamp_image) && (
                            <div className="mt-4 p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg inline-block">
                                <img src={previews.stamp_image || getImageUrl(userToEdit.stamp_image)} alt="Vista previa del sello" className="w-32 h-32 object-contain" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-8 pt-4">
                 <div className="flex items-start">
                    <div className="flex h-5 items-center">
                        <input id="is_admin" name="is_admin" type="checkbox" checked={formData.is_admin} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="is_admin" className="font-medium text-gray-700 dark:text-gray-300">¿Es Administrador?</label>
                    </div>
                </div>
                <div className="flex items-start">
                    <div className="flex h-5 items-center">
                        <input id="is_active" name="is_active" type="checkbox" checked={formData.is_active} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="is_active" className="font-medium text-gray-700 dark:text-gray-300">¿Está Activo?</label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button type="submit" disabled={loading} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50">
                    {loading ? 'Guardando...' : (userToEdit ? 'Actualizar Usuario' : 'Registrar Usuario')}
                </button>
            </div>
        </form>
    );
};

export default UserForm;
