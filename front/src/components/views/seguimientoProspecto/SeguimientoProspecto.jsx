import { useEffect } from "react";
import { useState } from "react";
import crmApi from "../../../../api/crmApi";
import { LineaTiempo } from "./components/LineaTiempo";
import { useAuth } from "../../../AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../../api/api";
import { InformacionPersonal } from "./components/InformacionPersonal";
import { BuroCredito } from "./components/BuroCredito";
import { Bitacora } from "./components/Bitacora";

function SeguimientoProspecto({setVista, prospectoSeguimiento}) {

    const [prospectoData, setProspectoData] = useState(prospectoSeguimiento)
    
    const { user } = useAuth()
    const queryClient = useQueryClient();

    const { 
        mutate: addEvento, 
        isPending: isAssigningProspecto 
    } = useMutation({
        mutationFn: api.addEvento,
        onSuccess: (data) => {
            console.log('Prospecto asignado con éxito:', data);
            setProspectoData(data.prospecto);
            queryClient.invalidateQueries({ queryKey: ['prospectos'] });
        },
        onError: (error) => {
            console.error('Error al asignar el prospecto:', error);
        },
    });

    useEffect(() => {
        if (!prospectoSeguimiento && setVista) {
            setVista("prospectos");
        }
    }, [prospectoSeguimiento, setVista]);

    if (!prospectoSeguimiento) {
        return null;
    }

    const handleAsignarmelo = () => {
        const nuevoEvento = {
            evento: 'Ejecutivo asignado',
            descripcion: 'Ejecutivo asignado al prospecto',
            fecha: new Date(),
            assignedTo: user.id
        };
        addEvento({
            prospectoId: prospectoData?._id,
            data: nuevoEvento
        });
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8 font-sans text-slate-800">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
            <div>
            <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-3">
                <span onClick={() => setVista && setVista("prospectos")} className="hover:text-slate-700 cursor-pointer">
                Prospectos
                </span>
                <span>/</span>
                <span className="text-green-900 font-semibold">{prospectoData?.firstName}</span>
            </nav>

            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-lg border border-green-200 shadow-sm">
                {prospectoData?.firstName?.[0]}
                {prospectoData?.lastName?.[0]}
                </div>
                <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                    {prospectoData?.firstName} {prospectoData?.lastName}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-full text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    En seguimiento
                    </span>
                    <span className="text-slate-400 text-xs">•</span>
                    <span className="text-slate-500 text-xs">Lizbeth</span>
                </div>
                </div>
            </div>
            </div>

            {!prospectoData?.assignedTo && ["5", "6"].includes(user?.userLevel) && (
                <button
                    type="button"
                    onClick={handleAsignarmelo}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Asignármelo
                </button>
            )}
        </div>

        <div className="grid grid-cols-12 gap-6">
            <InformacionPersonal prospecto={prospectoData}/>
            <LineaTiempo prospecto={prospectoData}/>
            <BuroCredito  />
            <Bitacora prospectoData={prospectoData} setProspectoData={setProspectoData} user={user} setVista={setVista} />
        </div>
    </div>
)}

export default SeguimientoProspecto;