import { Icon } from "../../../helpers/Icon";
import { StatusBadge } from "./StatusBadge";

export const CandidateTable = ({candidatos, setVista, setProspectoSeguimiento}) => {

    const getSemaforoEstilo = (lastDateControl) => {
        if (!lastDateControl) {
            return {
                dotClass: "bg-stone-300",
                badgeClass: "bg-stone-100 text-stone-600 border-stone-200",
                texto: "Sin registro"
            };
        }

        const hoy = new Date();
        const fechaControl = new Date(lastDateControl);

        hoy.setHours(0, 0, 0, 0);
        fechaControl.setHours(0, 0, 0, 0);

        const diferenciaMs = hoy.getTime() - fechaControl.getTime();
        const dias = Math.round(diferenciaMs / (1000 * 60 * 60 * 24));
        if (dias <= 0) {
            return {
                dotClass: "bg-emerald-500",
                badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
                texto: `Al día (${dias} d)`
            };
        } else if (dias <= 6) {
            return {
                dotClass: "bg-amber-500",
                badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
                texto: `En riesgo (${dias} d)`
            };
        } else {
            return {
                dotClass: "bg-rose-500",
                badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
                texto: `Inactivo (${dias} d)`
            };
        }
    };

    const handleAccions = (c, e) => {
        setProspectoSeguimiento(c)
        setVista('seguimientoProspecto')
    }
    
    return (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm max-h-125 overflow-y-auto relative">

            {/* Vista tabla — solo desktop */}
            <table className="w-full text-left border-collapse hidden md:table">
                <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 sticky top-0 z-10 shadow-sm">
                        <th className="px-6 py-4 text-sm font-semibold text-stone-900 bg-stone-50">Prospecto</th>
                        <th className="px-6 py-4 text-sm font-semibold text-stone-900 bg-stone-50">Sucursal</th>
                        <th className="px-6 py-4 text-sm font-semibold text-stone-900 bg-stone-50">Ultimo control</th>
                        <th className="px-6 py-4 text-sm font-semibold text-stone-900 bg-stone-50">Producto de interés</th>
                        <th className="px-6 py-4 text-sm font-semibold text-stone-900 bg-stone-50">Estatus</th>
                        <th className="px-6 py-4 text-sm font-semibold text-stone-900 bg-stone-50">Ejecutivo</th>
                        <th className="px-6 py-4 text-sm font-semibold text-stone-900 bg-stone-50">Seguimiento</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                    {candidatos?.map((c) => {
                        const ultimoEvento = c.eventos && c.eventos.length > 0 
                            ? [...c.eventos].sort((a, b) => new Date(a.fecha) - new Date(b.fecha)).at(-1)
                            : null;

                        return (
                            <tr
                                key={c._id}
                                className="hover:bg-stone-50 transition-colors cursor-pointer"
                            >
                                <td className="px-6 py-6">
                                    <p className="text-sm font-semibold text-stone-900">{`${c.firstName} ${c.lastName}`}</p>
                                    <p className="text-[12px] text-stone-500">{c.contact}</p>
                                </td>
                                <td className="px-6 py-6 text-stone-500 text-sm">{c.branch}</td>
                                <td className="px-6 py-6 text-sm">
                                    <div className="flex flex-col gap-1.5 items-start">
                                        <span className="text-stone-600 font-medium">
                                            {c.lastDateControl
                                                ? new Date(c.lastDateControl).toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric' })
                                                : 'Sin fecha'}
                                        </span>
                                        {(() => {
                                            if(c.KPI == "Ahorro | Inversión" || c.KPI == "Desistió" || c.KPI == "Crédito colocado" || c.KPI == "Nuevo socio") return;
                                            
                                            const semaforo = getSemaforoEstilo(c.lastDateControl);
                                            return (
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-md border ${semaforo.badgeClass}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${semaforo.dotClass}`} />
                                                    {semaforo.texto}
                                                </span>
                                            );
                                        })()}
                                    </div>
                                </td>
                                <td className="px-6 py-6"><StatusBadge status={c.interested_product} /></td>
                                
                                <td className="px-6 py-6 text-sm text-stone-700">
                                    {ultimoEvento ? (
                                        ultimoEvento.evento == 'Conclusión'
                                            ? `${c.KPI}`
                                            : ultimoEvento.evento
                                    ) : (
                                        'Sin eventos'
                                    )}
                                </td>

                                <td className="px-6 py-6">
                                    {c.assignedTo?.firstName ? (
                                        <div className="flex items-center gap-2 group cursor-pointer">
                                            <Icon name="person" className="text-stone-500" />
                                            <span className="text-sm italic text-stone-500">{c.assignedTo?.firstName} {c.assignedTo?.lastName}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 group cursor-pointer">
                                            <Icon name="person_off" className="text-stone-500" />
                                            <span className="text-sm italic text-stone-500">No asignado</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-6 text-center">
                                    <button type="button" onClick={(e) => handleAccions(c, e)} className="inline-flex items-center justify-center gap-2 group cursor-pointer">
                                        <Icon name="handshake" className="text-stone-500 group-hover:text-emerald-900 transition-colors" />
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Vista móvil: tarjetas */}
            <div className="md:hidden divide-y divide-stone-200">
                {candidatos?.map((c) => {
                    const ultimoEvento = c.eventos && c.eventos.length > 0
                        ? [...c.eventos].sort((a, b) => new Date(a.fecha) - new Date(b.fecha)).at(-1)
                        : null;

                    const mostrarSemaforo = !(
                        c.KPI == "Ahorro | Inversión" ||
                        c.KPI == "Desistió" ||
                        c.KPI == "Crédito colocado" ||
                        c.KPI == "Nuevo socio"
                    );
                    const semaforo = mostrarSemaforo ? getSemaforoEstilo(c.lastDateControl) : null;

                    return (
                        <div
                            key={c._id}
                            onClick={(e) => handleAccions(c, e)}
                            className="p-4 active:bg-stone-100 transition-colors cursor-pointer"
                        >
                            {/* Fila superior: nombre + ícono indicador */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-stone-900 truncate">
                                        {`${c.firstName} ${c.lastName}`}
                                    </p>
                                    <p className="text-[12px] text-stone-500 truncate">{c.contact}</p>
                                </div>
                                <Icon name="handshake" className="shrink-0 text-stone-400 text-[20px]" />
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-2">
                                <StatusBadge status={c.interested_product} />
                                <span className="text-[12px] text-stone-500">{c.branch}</span>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] uppercase tracking-wide text-stone-400">Último control</span>
                                    <span className="text-sm font-medium text-stone-700">
                                        {c.lastDateControl
                                            ? new Date(c.lastDateControl).toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric' })
                                            : 'Sin fecha'}
                                    </span>
                                </div>
                                {semaforo && (
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-md border ${semaforo.badgeClass}`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${semaforo.dotClass}`} />
                                        {semaforo.texto}
                                    </span>
                                )}
                            </div>

                            <div className="mt-3 text-sm text-stone-700">
                                {ultimoEvento ? (
                                    ultimoEvento.evento == 'Conclusión' ? c.KPI : ultimoEvento.evento
                                ) : (
                                    <span className="text-stone-400 italic">Sin eventos</span>
                                )}
                            </div>

                            <div className="mt-3 flex items-center gap-2">
                                {c.assignedTo?.firstName ? (
                                    <>
                                        <Icon name="person" className="text-stone-400 text-[18px]" />
                                        <span className="text-[13px] text-stone-500">
                                            {c.assignedTo?.firstName} {c.assignedTo?.lastName}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Icon name="person_off" className="text-stone-400 text-[18px]" />
                                        <span className="text-[13px] text-stone-400 italic">No asignado</span>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
)}