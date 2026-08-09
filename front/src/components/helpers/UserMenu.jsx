import { useNavigate } from "react-router";
import { useAuth } from "../../AuthContext";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { useQueryClient } from "@tanstack/react-query";

export const UserMenu = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!open) return;

        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    const handleLogout = () => {
        setOpen(false);
        logout();
        queryClient.clear();
        navigate('/login', { replace: true });
    };

    return (
        <div className="relative" ref={menuRef}>
            {open && (
                <div
                    className="absolute bottom-full left-0 mb-2 w-full bg-white border border-stone-200
                    rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-1 duration-150"
                >
                    <div className="px-4 py-3 border-b border-stone-100">
                        <p className="text-sm font-semibold text-stone-900">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-stone-500">{user?.email}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium
                        text-red-600 hover:bg-red-50 transition-colors duration-150 text-left"
                    >
                        <Icon name="logout" />
                        Cerrar sesión
                    </button>
                </div>
            )}

            <button
                onClick={() => setOpen((prev) => !prev)}
                className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-stone-100 transition-colors duration-150"
            >
                <div className="w-10 h-10 rounded-full bg-stone-300 object-cover shrink-0"></div>
                <div className="text-left overflow-hidden">
                    <p className="text-sm font-semibold truncate">
                        {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-[11px] text-stone-500 truncate">{user?.branch}</p>
                </div>
                <Icon name={open ? 'expand_more' : 'expand_less'} className="ml-auto shrink-0" />
            </button>
        </div>
    );
};
