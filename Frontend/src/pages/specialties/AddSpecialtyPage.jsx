import React, { useEffect } from 'react';
import { useHeader } from '../../context/HeaderContext';
import SpecialtyForm from '../../components/SpecialtyForm';

const AddSpecialtyPage = () => {
    const { setHeader } = useHeader();

    useEffect(() => {
        setHeader({
            title: 'Añadir Nueva Especialidad',
            subtitle: 'Completa los datos para registrar una nueva especialidad.'
        });
    }, [setHeader]);

    return <SpecialtyForm />;
};

export default AddSpecialtyPage;
