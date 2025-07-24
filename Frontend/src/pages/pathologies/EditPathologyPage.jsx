import React, { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useHeader } from '../../context/HeaderContext';
import PathologyForm from '../../components/PathologyForm';

const EditPathologyPage = () => {
    const { setHeader } = useHeader();
    const { state } = useLocation();
    const { pathologyId } = useParams();
    const pathologyToEdit = state?.pathology;

    useEffect(() => {
        setHeader({
            title: `Editando ${pathologyToEdit?.name || 'Patología'}`,
            subtitle: `Modifica los detalles de la patología con ID: ${pathologyId}`
        });
    }, [setHeader, pathologyId, pathologyToEdit]);

    return <PathologyForm pathologyToEdit={pathologyToEdit} />;
};

export default EditPathologyPage;
