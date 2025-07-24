import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
// FIX: La ruta ahora sube dos niveles (../../)
import { useHeader } from '../../context/HeaderContext';
import UserForm from '../../components/UserForm';

const EditUserPage = () => {
    const { setHeader } = useHeader();
    const { state } = useLocation();
    const { userId } = useParams();
    const userToEdit = state?.user;

    useEffect(() => {
        setHeader({
            title: `Editando a ${userToEdit?.name || 'Usuario'}`,
            subtitle: `Modifica los detalles del usuario con ID: ${userId}`
        });
    }, [setHeader, userId, userToEdit]);

    return <UserForm userToEdit={userToEdit} />;
};

export default EditUserPage;
