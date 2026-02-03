import React, { useState, useEffect } from 'react'
import { LuBox, LuSquareUser, LuNotebookPen, LuClock4 } from 'react-icons/lu'
import { TbUsers } from 'react-icons/tb'
import { useNavigate, useLocation } from 'react-router-dom';
import { IoLogOutOutline } from "react-icons/io5";
import { useAuth } from '../../shared/hooks/useAuth';

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const [activeLink, setActiveLink] = useState<number | null>(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const SIDEBAR_LINKS = [
        { id: 0, path: "/", name: "Panel", icon: LuBox },
        { id: 1, path: "/admin", name: "Admin", icon: TbUsers },
        { id: 2, path: "/register", name: "Registrar", icon: LuNotebookPen },

    ];

    const SETTINGS_INDEX = SIDEBAR_LINKS.length;

    // Detectar ruta actual y seleccionar el link activo automáticamente
    useEffect(() => {
        const found = SIDEBAR_LINKS.find(link => link.path === location.pathname);
        if (found) setActiveLink(found.id);
        else if (location.pathname === "/configuracion") setActiveLink(SETTINGS_INDEX);
    }, [location.pathname]);

    const handleNavigate = (index: number, path: string) => {
        setActiveLink(index);
        navigate(path);
    };

    return (
        <div className="
                w-18 md:w-52 
                fixed left-0 top-0 z-10 
                h-[100dvh] md:h-screen
                border-r border-[#E9E8E9] 
                pt-4  bg-white 
                transition-all duration-300 
                flex flex-col
            ">

            {/* LOGO */}
            <div className="mb-2 border-b flex items-center  py-3 border-[#D4D4D4]">
                <span className="text-3xl mx-auto font-bold hidden md:block">
                    UPCHIAPAS
                </span>
                <span className='text-3xl mx-auto font-bold md:hidden block'>UP</span>
            </div>

            {/* LINKS */}
            <ul className="space-y-3 flex-1 overflow-y-auto sidebar-scroll px-3">
                {SIDEBAR_LINKS.map((link) => (
                    <li
                        key={link.id}
                        onClick={() => handleNavigate(link.id, link.path)}
                        className={`
                                font-medium rounded-md py-0 px-3 cursor-pointer
                                ${activeLink === link.id ? "bg-[#F9F9FB] border border-[#D4D4D4]" : ""}
                            `}
                    >
                        <div className="flex justify-center md:justify-start items-center md:space-x-3 py-3">
                            <link.icon
                                className={`w-5 h-5 ${activeLink === link.id ? "text-[#715DB4] " : "text-gray-600"}`}
                            />
                            <span
                                className={`
                                        text-sm hidden md:flex 
                                        ${activeLink === link.id ? "text-[#715DB4]" : "text-gray-500"}
                                    `}
                            >
                                {link.name}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>

            {/* LOG OUT */}
            <div className="mt-auto py-2 px-3">
                <button
                    onClick={() => setShowLogoutModal(true)}
                    className={`
                            flex items-center md:justify-start justify-center
                            gap-3 md:space-x-1
                            py-3 px-3
                            rounded-md cursor-pointer transition w-full
                            font-medium
                            ${activeLink === SETTINGS_INDEX
                            ? "bg-[#145DFD] text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }
                        `}
                >
                    <IoLogOutOutline
                        size={20}
                        className={activeLink === SETTINGS_INDEX ? "text-white" : "text-red-600"}
                    />

                    <span className={`
                            text-sm hidden md:flex
                            ${activeLink === SETTINGS_INDEX ? "text-white" : "text-red-500"}
                        `}>
                        Cerrar sesión
                    </span>
                </button>
            </div>

            {/* LOGOUT CONFIRMATION MODAL */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
                    <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-6">Cerrar sesión</h2>
                            
                            <p className="mt-2 text-sm text-slate-600">
                                ¿Estás seguro de que deseas cerrar sesión?
                            </p>
                        </div>
                        <div className="flex gap-3 border-t border-slate-200 px-6 py-4">
                            <button
                                type="button"
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowLogoutModal(false);
                                    logout();
                                }}
                                className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-red-500/20 transition hover:bg-red-500"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Sidebar;
