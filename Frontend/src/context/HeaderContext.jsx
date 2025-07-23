import React, { createContext, useState, useContext, useMemo } from 'react';

// 1. Creamos el contexto
const HeaderContext = createContext();

// 2. Creamos el proveedor del contexto
export const HeaderProvider = ({ children }) => {
    const [header, setHeader] = useState({
        title: 'Dashboard',
        subtitle: 'Bienvenido a tu panel de control.'
    });

    // Usamos useMemo para evitar re-renders innecesarios
    const value = useMemo(() => ({ header, setHeader }), [header]);

    return (
        <HeaderContext.Provider value={value}>
            {children}
        </HeaderContext.Provider>
    );
};

// 3. Creamos un hook personalizado para usar el contexto fácilmente
export const useHeader = () => {
    const context = useContext(HeaderContext);
    if (!context) {
        throw new Error('useHeader debe ser usado dentro de un HeaderProvider');
    }
    return context;
};
