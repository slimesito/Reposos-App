import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHeader } from '../context/HeaderContext'; // 1. Importa el hook
import { User, KeyRound, Upload, ShieldCheck, ShieldAlert } from 'lucide-react';

const ProfilePage = () => {
    const { user, updateProfile } = useAuth();
    const { setHeader } = useHeader(); // 2. Usa el hook
    const [newPassword, setNewPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    // ... (el resto de los estados no cambian)
    const [profilePicture, setProfilePicture] = useState(null);
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState({ type: '', content: '' });
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    // 3. Establece el encabezado cuando el componente se monta
    useEffect(() => {
        setHeader({
            title: 'Mi Perfil',
            subtitle: 'Actualiza tu información personal y de seguridad.'
        });
    }, [setHeader]);

    // ... (el resto del componente no cambia)
    const storageBaseUrl = 'http://localhost:8000';
    const currentPictureUrl = user?.profile_picture
        ? `${storageBaseUrl}/${user.profile_picture.startsWith('/') ? user.profile_picture.substring(1) : user.profile_picture}`
        : `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0D8ABC&color=fff`;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', content: '' });

        if (newPassword && newPassword !== passwordConfirmation) {
            setMessage({ type: 'error', content: 'Las contraseñas no coinciden.' });
            return;
        }

        setIsLoading(true);
        const result = await updateProfile({
            password: newPassword,
            profile_picture: profilePicture,
        });
        setIsLoading(false);

        if (result.success) {
            setMessage({ type: 'success', content: result.message });
            setNewPassword('');
            setPasswordConfirmation('');
            setProfilePicture(null);
            setPreview(null);
            if(fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } else {
            setMessage({ type: 'error', content: result.message });
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Editar Perfil</h2>

                {message.content && (
                    <div className={`p-4 mb-6 rounded-lg flex items-center ${message.type === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                        {message.type === 'success' ? <ShieldCheck className="mr-3" /> : <ShieldAlert className="mr-3" />}
                        {message.content}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Foto de Perfil
                        </label>
                        <div className="flex items-center space-x-6">
                            <img
                                src={preview || currentPictureUrl}
                                alt="Vista previa"
                                className="w-24 h-24 rounded-full object-cover bg-gray-200"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                className="hidden"
                                id="profile_picture_input"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                <Upload className="w-5 h-5 mr-2" />
                                Cambiar foto
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Cambiar Contraseña (opcional)
                        </label>
                        <div className="space-y-4">
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="Nueva Contraseña"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-10 pr-3 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    placeholder="Confirmar Nueva Contraseña"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    className="w-full pl-10 pr-3 py-3 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                        >
                            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
