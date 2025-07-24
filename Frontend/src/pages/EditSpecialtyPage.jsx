import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useHeader } from '../context/HeaderContext';
import SpecialtyForm from '../components/SpecialtyForm';

const EditSpecialtyPage = () => {
    const { setHeader } = useHeader();
    const { state } = useLocation();
    const { specialtyId } = useParams();
    const specialtyToEdit = state?.specialty;

    useEffect(() => {
        setHeader({
            title: `Editando ${specialtyToEdit?.name || 'Especialidad'}`,
            subtitle: `Modifica los detalles de la especialidad con ID: ${specialtyId}`
        });
    }, [setHeader, specialtyId, specialtyToEdit]);

    return <SpecialtyForm specialtyToEdit={specialtyToEdit} />;
};

export default EditSpecialtyPage;
