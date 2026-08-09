import { Icon } from "../../../helpers/Icon"

export const StatsRecap = ({metrics}) => {
  
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="md:col-span-1 bg-stone-50 p-6 rounded-xl border border-stone-200">
                <Icon name="trending_up" className="text-emerald-950 mb-3" />
                <p className="text-xs text-stone-500 uppercase tracking-wider">Tasa de conversión a socio</p>
                <h3 className="text-2xl font-semibold text-emerald-950">{`${metrics?.porcentajeConversion}`}</h3>
                <p className="text-[11px] text-emerald-700 mt-2">Desde el último mes</p>
            </div>

            <div className="md:col-span-1 bg-stone-50 p-6 rounded-xl border border-stone-200">
                <Icon name="schedule" className="text-amber-700 mb-3" />
                <p className="text-xs text-stone-500 uppercase tracking-wider">Tiempo promedio de contacto (DÍAS)</p>
                <h3 className="text-2xl font-semibold text-amber-700">{`${metrics?.promedioDias}`}</h3>
                <p className="text-[11px] text-amber-600 mt-2">Target: 5.0 días</p>
            </div>

            <div className="md:col-span-2 bg-emerald-900 p-6 rounded-xl border border-emerald-950 relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-2xl font-semibold text-white mb-2">Crecimiento de socios</h3>
                    <p className="text-emerald-100 opacity-90 max-w-sm">
                        {!metrics.totalProspectos ? (
                            "¡Es el momento perfecto para salir a buscar nuevas oportunidades y empezar a construir!"
                        ) : (
                            `${metrics.totalProspectos} nuevos prospectos. Ahora nos toca el paso más emocionante: conectar, inspirar y cerrar con todo. ¡El éxito es de los que ejecutan!`
                        )}
                    </p>
                </div>
                <div className="absolute -right-5 -bottom-5 opacity-10">
                    <Icon name="group_add" className="text-white" style={{ fontSize: "160px" }} />
                </div>
            </div>
        </div>
)}