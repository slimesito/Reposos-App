import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useHeader } from '../../context/HeaderContext';
import HospitalForm from '../../components/HospitalForm';

const EditHospitalPage = () => {
    const { setHeader } = useHeader();
    const { state } = useLocation();
    const { hospitalId } = useParams();
    const hospitalToEdit = state?.hospital;

    useEffect(() => {
        setHeader({
            title: `Editando ${hospitalToEdit?.name || 'Hospital'}`,
            subtitle: `Modifica los detalles del hospital con ID: ${hospitalId}`
        });
    }, [setHeader, hospitalId, hospitalToEdit]);

    return <HospitalForm hospitalToEdit={hospitalToEdit} />;
};

export default EditHospitalPage;
