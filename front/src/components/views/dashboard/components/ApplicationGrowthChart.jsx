import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../../../api/api";

export const ApplicationGrowthChart = () => {

    const [hovered, setHovered] = useState(null);

    const { data: graphic = [] } = useQuery({
        queryKey: ["graphic"] ,
        queryFn: api.getGraphic,
    });
    
    return (
        <div className="lg:col-span-8 bg-white rounded-lg transition-all">
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <h4 className="text-xl font-semibold mb-3">Crecimiento de Prospectos</h4>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-stone-300" />
                        <span className="text-xs font-medium">Prospectos Totales</span>
                    </div>
                    <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                        <span className="text-xs font-medium">Conversión a Socios</span>
                    </div>
                </div>
            </div>

            <div className="flex items-end justify-between gap-6 px-4 h-64 border-b border-stone-200 pb-2">
                {graphic.map((d, i) => {
                    const isHovered = hovered === i;
                    const isAnyHovered = hovered !== null;
                    
                    return (
                        <div
                            key={`${d.month}${i}`}
                            className="relative flex-1 flex justify-center items-end h-full cursor-pointer"
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <div className={`flex items-end gap-1 w-full justify-center h-full transition-opacity duration-200 ${isAnyHovered && !isHovered ? "opacity-40" : ""}`}>
                                <div
                                    className={`w-5 bg-slate-200 rounded-t-sm transition-all ${isHovered ? "bg-slate-300" : ""}`}
                                    style={{ height: `${d.prospectosHeight}%` }}
                                />
                                <div
                                    className={`w-5 bg-emerald-400 rounded-t-sm transition-all ${isHovered ? "bg-emerald-500" : ""}`}
                                    style={{ height: `${d.sociosHeight}%` }}
                                />
                            </div>

                            {isHovered && (
                                <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] p-2 rounded shadow-lg z-10 whitespace-nowrap flex flex-col gap-0.5 pointer-events-none border border-slate-800">
                                    <span className="font-bold border-b border-slate-800 pb-0.5 mb-0.5 text-center">{d.month}</span>
                                    <span>👥 Prospectos: <span className="font-semibold">{d.prospectosValue}</span></span>
                                    <span>🤝 Socios: <span className="font-semibold">{d.sociosValue}</span></span>
                                    <span className="text-emerald-300">📈 Conversión: <span className="font-semibold">{d.conversion}</span></span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between gap-6 px-4 pt-1 text-stone-500 text-xs">
                {graphic.map((d, i) => (
                    <div key={`${d.month}${i}`} className="flex-1 flex justify-center text-center">
                        <span className={`transition-colors ${hovered === i ? "text-emerald-600 font-medium" : ""}`}>
                            {d.month}
                        </span>
                    </div>
                ))}
            </div>
        </div>
)}