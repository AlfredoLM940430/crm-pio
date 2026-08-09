import { useEffect, useState } from "react";
import { Icon } from "../../helpers/Icon";
import { NotificationCenter } from "./components/NotificationCenter";

export const TopBar = ({setSidebarOpen}) => {

    const [fecha, setFecha] = useState('');

    useEffect(() => {
        const formatearFecha = () => {
            const ahora = new Date();
            return ahora.toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
            }) + ' • ' + ahora.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        };

        setFecha(formatearFecha());

        const intervalo = setInterval(() => {
            setFecha(formatearFecha());
        }, 60000);

        return () => clearInterval(intervalo);
    }, []);

    return (
        <header className="fixed top-0 right-0 left-0 md:left-64 z-40 bg-white border-b border-stone-200 flex justify-between items-center h-16 px-4 sm:px-6 md:px-10">
            <div className="flex items-center gap-3">
                <button 
                    className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors" 
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Abrir menú"
                >
                    <Icon name="menu" className="w-5 h-5" />
                </button>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
                <NotificationCenter />
                
                <div className="hidden sm:flex items-center gap-2 bg-stone-50 px-3.5 py-1.5 rounded-xl border border-stone-200/80 text-stone-600 text-xs sm:text-sm font-medium shadow-2xs">
                    <span className="capitalize">{fecha}</span>
                </div>
            </div>
        </header>
)}