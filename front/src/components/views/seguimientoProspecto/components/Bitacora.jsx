import { useEffect, useState } from "react";
import { api } from "../../../../../api/api";
import crmApi from "../../../../../api/crmApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TextField } from "../../addProspecto/components/TextField";
import { SelectField } from "../../addProspecto/components/SelectField";
import { useForm } from "../../../../hooks/useForm";

const initialSeguimiento = {
    tipoSeleccionado: "",
    subOpcionConclusion: "",
    subOpcionNuevoSocio: "",
    fechaHoraCita: "",
    cantidadSolicitada: "",
    nota: "",
};

export const Bitacora = ({prospectoData, setProspectoData, user, setVista}) => {

    const eventosExcluidos = ["Alta de prospecto", "Ejecutivo asignado"];
    const [tiposDisponibles, setTiposDisponibles] = useState([]);
    const [cargando, setCargando] = useState(true);
    
    const { values, errors, updateField, updateFields, setFieldError, validate, reset } = useForm(initialSeguimiento);

    const isConcluded = prospectoData?.eventos?.some((e) => e.evento === "Conclusión"); 
    
    // Extraemos los IDs asegurando compatibilidad con user.id o user._id
    const userId = user?.id || user?._id;
    const assignedToId = prospectoData?.assignedTo;

    // Comparamos directamente los dos textos
    const isOwner = Boolean(userId && assignedToId && userId === assignedToId);

    // const isOwner = user?.id === prospectoData?.assignedTo?._id; //!
    const hasValidLevel = ["5", "6"].includes(user?.userLevel);
    const isDisabled = isConcluded || !isOwner || !hasValidLevel;

    console.log(prospectoData?.assignedTo?._id);
    
    const cargarTiposDisponibles = async () => {
        setCargando(true);
        try {
            const res = await crmApi.get(`/prospectos/${prospectoData?._id}/eventos/disponibles`);
            if (res.data.ok) {
                setTiposDisponibles(res.data.data);
            }
        } catch (error) {
            console.error("Error al consultar candidatos", error);
        }
        setCargando(false);
    };

    useEffect(() => {
        cargarTiposDisponibles();
    }, [prospectoData]);

    const { mutate: addEvento, isPending } = useMutation({
        mutationFn: api.addEvento,
        onSuccess: (data) => {
            setProspectoData((prev) => ({ ...prev, ...data }));
            reset();
            setVista("prospectos");
        },
        onError: (error) => {
            console.error("Error al guardar el prospecto:", error);
            setFieldError("nota", "No se pudo registrar el evento. Intenta de nuevo.");
        },
    });

    const registrarSeguimiento = (e) => {
        e.preventDefault();

        if (isDisabled) return;

        const ok = validate({
            tipoSeleccionado: (v) => (!v ? "Selecciona un tipo de evento" : undefined),
            nota: (v) => (!v?.trim() ? "La nota es requerida" : undefined),
            fechaHoraCita: (v, all) =>
                all.tipoSeleccionado === "Cita programada" && !v
                    ? "Selecciona fecha y hora de la cita"
                    : undefined,
            cantidadSolicitada: (v, all) =>
                all.subOpcionNuevoSocio === "credito_colocado" && !v
                    ? "Indica la cantidad solicitada"
                    : undefined,
        });
        if (!ok) return;

        addEvento({
            prospectoId: prospectoData?._id,
            data: {
                ...values,
                evento: values?.tipoSeleccionado,
                descripcion: values?.nota,
                registerBy: user?.id,
            },
        });
    };

    if (cargando) return <p>Cargando...</p>;

    return (
        <div className="col-span-12 bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Bitácora de seguimiento
                </h3>
            </div>

            <form className="space-y-4 mb-5" onSubmit={registrarSeguimiento}>
                <div className="flex flex-col gap-4">

                    <div className="space-y-4 w-full">
                        <SelectField
                            label="Selecciona nuevo evento"
                            id="tipoSeleccionado"
                            placeholder="Selecciona una opción"
                            options={tiposDisponibles.map((tipo) => ({ value: tipo, label: tipo }))}
                            value={values.tipoSeleccionado}
                            onChange={(e) => {
                                const nuevoTipo = e.target.value;
                                updateFields({
                                    ...initialSeguimiento,
                                    tipoSeleccionado: nuevoTipo
                                });
                            }}
                            disabled={tiposDisponibles.length === 0 || isDisabled}
                            error={errors.tipoSeleccionado}
                        />

                        {values.tipoSeleccionado === "Cita programada" && (
                            <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                                <TextField
                                    label="Fecha y hora de la cita"
                                    id="fechaHoraCita"
                                    type="datetime-local"
                                    value={values.fechaHoraCita}
                                    onChange={(e) => updateField("fechaHoraCita", e.target.value)}
                                    error={errors.fechaHoraCita}
                                    disabled={isDisabled}
                                    required
                                />
                            </div>
                        )}

                        {values.tipoSeleccionado === "Conclusión" && (
                            <div className="space-y-4 pl-3 sm:pl-4 border-l-2 border-slate-200 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                <SelectField
                                    label="Opciones de conclusión"
                                    id="subOpcionConclusion"
                                    placeholder="Selecciona una opción"
                                    options={[
                                        { value: "Nuevo socio", label: "Nuevo socio" },
                                        { value: "Desistió", label: "Desistió de ser socio" },
                                    ]}
                                    value={values.subOpcionConclusion}
                                    onChange={(e) =>
                                        updateFields({
                                            subOpcionConclusion: e.target.value,
                                            subOpcionNuevoSocio: "",
                                        })
                                    }
                                    disabled={isDisabled}
                                />

                                {values.subOpcionConclusion === "Nuevo socio" && (
                                    <div className="space-y-4 pl-3 sm:pl-4 border-l-2 border-emerald-500/40 ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <SelectField
                                            label="Detalle de nuevo socio"
                                            id="subOpcionNuevoSocio"
                                            placeholder="Selecciona una opción"
                                            options={[
                                                { value: "Crédito colocado", label: "Crédito colocado" },
                                                { value: "Ahorro | Inversión", label: "Solo ahorro" },
                                            ]}
                                            value={values.subOpcionNuevoSocio}
                                            onChange={(e) => updateField("subOpcionNuevoSocio", e.target.value)}
                                            disabled={isDisabled}
                                        />

                                        {values.subOpcionNuevoSocio === "Crédito colocado" && (
                                            <TextField
                                                label="Cantidad solicitada"
                                                id="cantidadSolicitada"
                                                type="number"
                                                placeholder="0.00"
                                                value={values.cantidadSolicitada}
                                                onChange={(e) => updateField("cantidadSolicitada", e.target.value)}
                                                error={errors.cantidadSolicitada}
                                                disabled={isDisabled}
                                                required
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <TextField
                            label="Nota de la interacción"
                            id="nota"
                            placeholder="Escribe los detalles..."
                            value={values.nota}
                            onChange={(e) => updateField("nota", e.target.value)}
                            error={errors.nota}
                            disabled={isDisabled}
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                            disabled={!values.tipoSeleccionado || isDisabled || isPending}
                        >
                            {isPending && (
                                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            )}
                            {isPending ? "Registrando..." : "Registrar"}
                        </button>
                    </div>

                </div>
            </form>

            <div className="pt-4 mt-2 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                    Historial
                </h4>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {(() => {
                        const eventosVisibles = prospectoData?.eventos?.filter(
                            (entrada) => !eventosExcluidos.includes(entrada?.evento)
                        );

                        if (eventosVisibles.length === 0) {
                            return (
                                <p className="text-sm text-slate-400 italic">
                                    Aún no hay eventos registrados.
                                </p>
                            );
                        }

                        const colorPorTipo = {
                            "Cita programada": "bg-amber-500",
                            "Conclusión": "bg-blue-500",
                        };

                        return eventosVisibles?.map((entrada) => (
                            <div key={entrada?._id} className="flex gap-3 text-sm">
                                <span
                                    className={`shrink-0 w-1.5 h-1.5 mt-2 rounded-full ${
                                        colorPorTipo[entrada?.evento] || "bg-emerald-500"
                                    }`}
                                />
                                <div className="min-w-0">
                                    <p className="text-slate-700 break-words">
                                        <span className="font-semibold text-slate-900">
                                            {entrada?.evento}
                                        </span>{" "}
                                        — {entrada?.descripcion}
                                    </p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        {new Date(entrada?.fecha).toLocaleDateString()}{" "}
                                        {new Date(entrada?.fecha).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        ));
                    })()}
                </div>
            </div>
        </div>
    );
};