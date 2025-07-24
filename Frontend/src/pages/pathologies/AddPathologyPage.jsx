import React, { useEffect } from 'react';
import { useHeader } from '../../context/HeaderContext';
import PathologyForm from '../../components/PathologyForm';

const AddPathologyPage = () => {
    const { setHeader } = useHeader();

    useEffect(() => {
        setHeader({
            title: 'Añadir Nueva Patología',
            subtitle: 'Completa los datos para registrar una nueva patología.'
        });
    }, [setHeader]);

    return <PathologyForm />;
};

export default AddPathologyPage;
