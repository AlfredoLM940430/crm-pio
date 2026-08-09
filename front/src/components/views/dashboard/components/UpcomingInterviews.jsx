import { useState } from "react";
// import { Icon } from "./Icon";
import { useEffect } from "react";
import crmApi from "../../../../../api/crmApi";
import { Icon } from "../../../helpers/Icon";

export const UpcomingInterviews = () => {

    const [activity, setActivity] = useState([])

    const handligGettingActivity = async () => {
        try {
            const res = await crmApi.get(`/incoming-appointments`);
            if (res.data.ok) {
            const actividad = res.data.data;
            setActivity(actividad)
            }
        } catch (error) {
            console.error('Error al consultar candidatos', error);
        }
    };

    useEffect(() => {
        handligGettingActivity();
    }, []);

    return (
        <div className="lg:col-span-12 bg-white border border-stone-200 p-6 rounded-lg">
            <h4 className="text-xl font-semibold mb-6">Proximas Citas</h4>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-stone-200">
                        <tr>
                            <th className="py-3 px-4 text-sm font-semibold text-stone-500">Prospecto</th>
                            <th className="py-3 px-4 text-sm font-semibold text-stone-500">
                                Producto de Interés
                            </th>
                            <th className="py-3 px-4 text-sm font-semibold text-stone-500">Fecha</th>
                            <th className="py-3 px-4 text-sm font-semibold text-stone-500">Ejecutivo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activity.map((row) => (
                            <tr
                                key={row._id}
                                className="border-b border-stone-200 hover:bg-stone-50 transition-colors"
                            >
                                <td className="py-4 px-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-stone-200" />
                                    <span className="text-sm">{row.name}</span>
                                </td>
                                <td className="py-4 px-4 text-sm">{row.interested_product}</td>
                                <td className="py-4 px-4 text-sm">
                                    {row.lastDateControl ? 
                                        new Date(row.lastDateControl).toLocaleDateString('es-ES', {
                                            day: 'numeric',
                                            month: 'numeric',
                                            year: 'numeric'
                                        }) 
                                        : 'Sin fecha'
                                    }
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-2">
                                        <Icon name="person_off" className="text-stone-500" />
                                        <span className="text-sm text-stone-500 italic">Unassigned</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
)}