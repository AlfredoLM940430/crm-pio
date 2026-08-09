import { useState } from "react";
import { useNotifications } from "../../../../hooks/useNotificationsAPI";
import { useEffect } from "react";
import { useRef } from "react";
import { useAuth } from "../../../../AuthContext";


export const NotificationCenter = () => {
    const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();
    
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user } = useAuth();
    
    const userLevel = user.userLevel

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex items-center justify-center p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors border border-stone-200/60 bg-white shadow-2xs focus:outline-none"
                aria-label="Abrir notificaciones"
            >
                <span className="text-lg">🔔</span>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-stone-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between px-4 pb-3 border-b border-stone-100">
                        <h3 className="text-sm font-semibold text-stone-800">Notificaciones</h3>
                        {notifications.length > 0 && (
                            <button 
                                onClick={() => clearAll(user.userLevel)}
                                className="text-xs font-medium text-stone-500 hover:text-red-600 transition-colors"
                            >
                                Limpiar todas
                            </button>
                        )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-stone-50">
                        {notifications.length === 0 ? (
                            <div className="py-8 text-center text-stone-400 text-sm">
                                No hay notificaciones
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div 
                                    key={notif._id}
                                    className={`p-4 transition-colors cursor-pointer flex flex-col gap-1 ${
                                        notif.leida ? 'bg-white hover:bg-stone-50/50' : 'bg-sky-50/60 hover:bg-sky-50'
                                    }`}
                                    onClick={() => {
                                        if (!notif.leida) {   
                                            markAsRead(notif._id, notif.usuarioIdm, userLevel);
                                        } 
                                    }}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <strong className="text-xs font-semibold text-stone-800">
                                            {notif.titulo || notif.title}
                                        </strong>
                                        <span className="text-[10px] text-stone-400 shrink-0">
                                            {new Date(notif.createdAt || notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-stone-600 leading-relaxed">{notif.mensaje || notif.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};