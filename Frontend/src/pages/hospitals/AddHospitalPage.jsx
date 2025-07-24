import React, { useEffect } from 'react';
import { useHeader } from '../../context/HeaderContext';
import HospitalForm from '../../components/HospitalForm';

const AddHospitalPage = () => {
    const { setHeader } = useHeader();

    useEffect(() => {
        setHeader({
            title: 'Añadir Nuevo Hospital',
            subtitle: 'Completa los datos para registrar un nuevo hospital.'
        });
    }, [setHeader]);

    return <HospitalForm />;
};

export default AddHospitalPage;
