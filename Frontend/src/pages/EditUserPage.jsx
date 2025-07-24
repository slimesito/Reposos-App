import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useHeader } from '../context/HeaderContext';
import UserForm from '../components/UserForm';

const EditUserPage = () => {
    const { setHeader } = useHeader();
    const { state } = useLocation(); // Obtenemos el usuario pasado desde la tabla
    const { userId } = useParams(); // Obtenemos el ID de la URL
    const userToEdit = state?.user;

    useEffect(() => {
        setHeader({
            title: `Editando a ${userToEdit?.name || 'Usuario'}`,
            subtitle: `Modifica los detalles del usuario con ID: ${userId}`
        });
    }, [setHeader, userId, userToEdit]);

    // Pasamos el usuario al formulario para que se pre-cargue con sus datos.
    return <UserForm userToEdit={userToEdit} />;
};

export default EditUserPage;
