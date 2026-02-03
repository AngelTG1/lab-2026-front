import React from 'react'
import { Link, Outlet, useMatches } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'
import { FaUserTie } from "react-icons/fa";

function Header() {
    const { isAuthenticated, user } = useAuth();
    const matches = useMatches();
    const hideShell = matches.some((m) => m.handle && (m.handle as any).hideShell);
    if (hideShell) {
        return <Outlet />
    }

    return (
        <div>
            <header className="sticky top-0 z-8 flex items-center justify-between gap-4 border-b border-[#D4D4D4] bg-white px-10 py-[15.2px]">
                <Link to="/" className="text-lg font-medium tracking-tight">
                    
                </Link>
                <nav className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    {isAuthenticated ? (
                        <>
                            <div className='flex flex-row items-center space-x-3 border rounded-sm border-[#D4D4D4] py-2 px-3'>
                                <div className=' bg-[#C9E6E4] w-7 h-7 rounded-sm flex justify-center items-center '>
                                    <FaUserTie className='text-black ' size={19} />
                                </div>
                                <span className=''>{user ? `${user.fullName}` : ''}</span>
                            </div>

                        </>
                    ) : (
                        <Link className="rounded-lg px-3 py-2 hover:bg-slate-100" to="/login">
                            Login
                        </Link>
                    )}
                </nav>
            </header>
        </div>
    )
}

export default Header