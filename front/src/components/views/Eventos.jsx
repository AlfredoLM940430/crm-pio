import { useEffect, useState } from "react";
import crmApi from "../../../api/crmApi";
import { CandidateTable } from "./prospectos/components/CandidateTable";
import { Icon } from "../helpers/Icon";

function Eventos() {

    const [candidatos, setCandidatos] = useState([])

    useEffect(() => {
        const handligGettingActivity = async () => {
            try {
                const res = await crmApi.get(`/incoming-all-appointments`);
                if (res.data.ok) {
                    const actividad = res.data.data;
                    setCandidatos(actividad)
                }
            } catch (error) {
                console.error('Error al consultar candidatos', error);
            }
        };
        handligGettingActivity();
    }, []);

    const onRemainder = async () => {
        try {
            const res = await crmApi.post('/reminder', { nombre: "Alfredo" });
            console.log("Notificación enviada con éxito", res.data);
        } catch (error) {
            console.error("Error al enviar el recordatorio", error);
        }
    }

    return (
        <div className="pt-6">
            <div className="">
                <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-6 rounded-xl border-b border-stone-100">
                    <div className="gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 tracking-tight">
                                    EVENTOS PROXIMOS
                                </h3>
                            </div>
                        </div>
                    </div>
                    <button 
                        className="bg-emerald-950 text-white px-6 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-emerald-900 transition-all active:scale-95 shadow-md"
                        onClick={onRemainder}
                    >
                    <Icon name="phone" />
                        Recordatorio
                    </button>
                </div>
            </div>
            <CandidateTable candidatos={candidatos}/>
        </div>
)}

export default Eventos;