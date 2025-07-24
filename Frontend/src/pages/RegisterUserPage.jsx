import React, { useEffect } from 'react';
import { useHeader } from '../context/HeaderContext';
// Este componente será muy similar a EditUserPage, podrías crear un UserForm reutilizable en el futuro.
// Por ahora, lo mantenemos separado por claridad.
import UserForm from '../components/UserForm';

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
