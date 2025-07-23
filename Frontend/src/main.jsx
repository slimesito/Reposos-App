import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HeaderProvider } from './context/HeaderContext'; // 1. Importa el nuevo proveedor
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <HeaderProvider> {/* 2. Envuelve la App con el HeaderProvider */}
          <App />
        </HeaderProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
