import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHeader } from '../context/HeaderContext';
import ThemeSwitcher from '../components/ui/ThemeSwitcher';
import {
    LayoutDashboard, LogOut, User, Stethoscope, Users, FileText,
    Hospital, BriefcaseMedical, Menu, ChevronDown, FileUser, HeartPulse,
    UserRoundPlus, UserRoundCog, FilePlus2, ListChecks // 1. Se importan nuevos íconos
} from 'lucide-react';

const Sidebar = ({ isSidebarOpen }) => {
    const location = useLocation();
    const { user } = useAuth();
    const [isUsersMenuOpen, setIsUsersMenuOpen] = useState(false);
    // 2. Se añade un estado para el nuevo menú de Reposos
    const [isRepososMenuOpen, setIsRepososMenuOpen] = useState(false);

    const NavLink = ({ to, icon, text, isSubmenu = false }) => {
        // Se ajusta la lógica para que el menú padre se mantenga activo
        const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
        return (
            <Link to={to} className={`flex items-center p-3 my-1 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'} ${isSubmenu ? 'pl-10' : ''}`}>
                {icon}
                <span className="ml-4 font-medium">{text}</span>
            </Link>
        );
    };

    return (
        <aside className={`h-full flex flex-col bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
            <div className="flex items-center justify-center p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                 <BriefcaseMedical className="text-blue-500" size={32} />
                 <h1 className="ml-3 text-2xl font-bold text-gray-800 dark:text-white">Reposos</h1>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
                <nav className="flex-1 p-4">
                    <NavLink to="/dashboard" icon={<LayoutDashboard size={20} />} text="Dashboard" />
                    
                    {/* --- FIX: Se convierte el botón de Reposos en un menú desplegable --- */}
                    <div>
                        <button onClick={() => setIsRepososMenuOpen(!isRepososMenuOpen)} className="w-full flex items-center justify-between p-3 my-1 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                            <div className="flex items-center">
                                <FileText size={20} />
                                <span className="ml-4 font-medium">Reposos</span>
                            </div>
                            <ChevronDown className={`transition-transform ${isRepososMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isRepososMenuOpen && (
                            <div className="ml-4 border-l-2 border-gray-200 dark:border-gray-600">
                                <NavLink to="/reposos/register" icon={<FilePlus2 size={18} />} text="Registrar un Reposo" isSubmenu />
                                <NavLink to="/reposos" icon={<ListChecks size={18} />} text="Listado de Reposos" isSubmenu />
                            </div>
                        )}
                    </div>

                    <NavLink to="/pacientes" icon={<FileUser size={20} />} text="Pacientes" />
                    
                    {user?.is_admin && (
                        <>
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
                                        <NavLink to="/users/register" icon={<UserRoundPlus />} text="Registrar" isSubmenu />
                                        <NavLink to="/users" icon={<UserRoundCog />} text="Gestionar" isSubmenu />
                                    </div>
                                )}
                            </div>
                            
                            <NavLink to="/hospitals" icon={<Hospital size={20} />} text="Hospitales" />
                            <NavLink to="/specialties" icon={<Stethoscope size={20} />} text="Especialidades" />
                            <NavLink to="/pathologies" icon={<HeartPulse size={20} />} text="Patologías" />
                        </>
                    )}
                </nav>
            </div>
        </aside>
    );
};

const Header = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const { header } = useHeader();
    const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
        <header className="relative z-30 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-4 flex items-center justify-between shadow-sm">
            <button onClick={toggleSidebar} className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 md:hidden">
                <Menu size={24} />
            </button>
            <div className="hidden md:block">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">{header.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{header.subtitle}</p>
            </div>
            
            <div className="flex items-center space-x-4">
                <ThemeSwitcher />
                
                <div className="relative" ref={profileMenuRef}>
                    <button 
                        onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
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
                        <span className="font-medium text-base text-gray-700 dark:text-gray-200 hidden sm:block">
                            {user?.name}
                        </span>
                        <ChevronDown size={16} className="text-gray-500 hidden sm:block" />
                    </button>

                    {isProfileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
                            <Link
                                to="/profile"
                                onClick={() => setProfileMenuOpen(false)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <User size={16} className="mr-3" />
                                Mi Perfil
                            </Link>
                            <button
                                onClick={() => {
                                    setProfileMenuOpen(false);
                                    logout();
                                }}
                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <LogOut size={16} className="mr-3" />
                                Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
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
