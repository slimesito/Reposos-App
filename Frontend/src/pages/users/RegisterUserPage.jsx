import React, { useEffect } from 'react';
// FIX: La ruta ahora sube dos niveles (../../) para encontrar la carpeta 'context'
import { useHeader } from '../../context/HeaderContext';
// FIX: La ruta ahora sube dos niveles (../../) para encontrar la carpeta 'components'
import UserForm from '../../components/UserForm';

const RegisterUserPage = () => {
    const { setHeader } = useHeader();

    useEffect(() => {
        setHeader({
            title: 'Registrar Nuevo Usuario',
            subtitle: 'Completa los datos para crear un nuevo usuario en el sistema.'
        });
    }, [setHeader]);

    return <UserForm />;
};

export default RegisterUserPage;
