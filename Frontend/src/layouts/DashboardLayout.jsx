import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHeader } from '../context/HeaderContext';
import ThemeSwitcher from '../components/ui/ThemeSwitcher';
import {
    LayoutDashboard, LogOut, User, Stethoscope, Users, FileText,
    Hospital, BriefcaseMedical, Menu, ChevronDown, FileUser // 1. Se importa el nuevo ícono
} from 'lucide-react';

const Sidebar = ({ isSidebarOpen }) => {
    const location = useLocation();
    const { user } = useAuth();
    const [isUsersMenuOpen, setIsUsersMenuOpen] = useState(false);

    const NavLink = ({ to, icon, text, isSubmenu = false }) => {
        const isActive = location.pathname === to;
        return (
            <Link to={to} className={`flex items-center p-3 my-1 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'} ${isSubmenu ? 'pl-10' : ''}`}>
                {icon}
                <span className="ml-4 font-medium">{text}</span>
            </Link>
        );
    };

    return (
        <aside className={`bg-white dark:bg-gray-800/50 backdrop-blur-sm h-full flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
            <div className="flex items-center justify-center p-6 border-b border-gray-200 dark:border-gray-700">
                 <BriefcaseMedical className="text-blue-500" size={32} />
                 <h1 className="ml-3 text-2xl font-bold text-gray-800 dark:text-white">Reposos</h1>
            </div>
            <nav className="flex-1 p-4">
                <NavLink to="/dashboard" icon={<LayoutDashboard size={20} />} text="Dashboard" />
                <NavLink to="/reposos" icon={<FileText size={20} />} text="Reposos" />
                
                {user?.is_admin && (
                    <div>
                        <button onClick={() => setIsUsersMenuOpen(!isUsersMenuOpen)} className="w-full flex items-center justify-between p-3 my-1 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                            <div className="flex items-center">
                                <Users size={20} />
                                <span className="ml-4 font-medium">Usuarios</span>
                            </div>
                            <ChevronDown className={`transition-transform ${isUsersMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isUsersMenuOpen && (
                            <div className="ml-4 border-l-2 border-gray-200 dark:border-gray-600">
                                <NavLink to="/users/register" icon={<></>} text="Registrar" isSubmenu />
                                <NavLink to="/users" icon={<></>} text="Gestionar" isSubmenu />
                            </div>
                        )}
                    </div>
                )}
                
                {/* 2. Se reemplaza el ícono de 'Users' por 'FileUser' */}
                <NavLink to="/pacientes" icon={<FileUser size={20} />} text="Pacientes" />
                
                <NavLink to="/hospitales" icon={<Hospital size={20} />} text="Hospitales" />
                <NavLink to="/especialidades" icon={<Stethoscope size={20} />} text="Especialidades" />
            </nav>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <NavLink to="/profile" icon={<User size={20} />} text="Mi Perfil" />
            </div>
        </aside>
    );
};

const Header = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const { header } = useHeader();
    const storageBaseUrl = 'http://localhost:8000';
    let profilePictureUrl = `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0D8ABC&color=fff`;

    if (user?.profile_picture) {
        let imagePath = user.profile_picture;
        if (imagePath.startsWith('/')) {
            imagePath = imagePath.substring(1);
        }
        profilePictureUrl = `${storageBaseUrl}/${imagePath}`;
    }

    return (
        <header className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-4 flex items-center justify-between shadow-sm">
            <button onClick={toggleSidebar} className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 md:hidden">
                <Menu size={24} />
            </button>
            <div className="hidden md:block">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">{header.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{header.subtitle}</p>
            </div>
            <div className="flex items-center space-x-4">
                <ThemeSwitcher />
                <div className="relative">
                    <img
                        src={profilePictureUrl}
                        alt="Foto de perfil"
                        onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src=`https://ui-avatars.com/api/?name=${user?.name || 'U'}&background=E91E63&color=fff`;
                        }}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></span>
                </div>
                <button onClick={logout} className="flex items-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-800/50 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                    <LogOut size={20} />
                    <span className="ml-2 hidden sm:inline">Cerrar Sesión</span>
                </button>
            </div>
        </header>
    );
};

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <div className="fixed md:static z-20 h-full">
                <Sidebar isSidebarOpen={isSidebarOpen} />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
