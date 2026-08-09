import { Icon } from "../../../helpers/Icon";

const METRIC_CONFIGS = [
    { id: 1, icon: "group", iconBg: "bg-emerald-100", iconColor: "text-emerald-950", delta: "", deltaColor: "text-emerald-950", label: "Prospectos totales", apiKey: "totalProspectos" },
    { id: 2, icon: "pending_actions", iconBg: "bg-orange-100", iconColor: "text-amber-800", delta: "", deltaColor: "text-amber-700", label: "Citas programadas", apiKey: "totalCitas" },
    { id: 3, icon: "verified", iconBg: "bg-emerald-800", iconColor: "text-white", delta: "", deltaColor: "text-emerald-950", label: "Socios nuevos", apiKey: "totalSociosNuevos" },
    { id: 4, icon: "money", iconBg: "bg-stone-200", iconColor: "text-stone-800", delta: "", deltaColor: "text-stone-700", label: "Créditos colocados ", apiKey: "totalCreditos" },
    // { id: 4, icon: "money", iconBg: "bg-stone-200", iconColor: "text-stone-800", delta: "", deltaColor: "text-stone-700", label: "Créditos colocados ", apiKey: "totalCreditos", noTrendIcon: true },
];

export const MetricsGrid = ({ metricsApi }) => {

    const metrics = METRIC_CONFIGS.map(metric => {
        const rawValue = metricsApi?.[metric.apiKey];
        return {
            ...metric,
            value: rawValue !== undefined && rawValue !== null ? rawValue.toLocaleString() : "0"
        };
    });

    return (
        <>
        <div className="flex items-center gap-4 mb-4 mt-8 first:mt-0">
            <h3 className="text-stone-800 text-base font-semibold whitespace-nowrap">
                Métricas
            </h3>
            <div className="h-px bg-stone-200 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {metrics.map((m) => (
                <div
                    key={m.id}
                    className="bg-white border border-stone-200 p-6 rounded-lg transition-all hover:shadow-[0px_4px_12px_rgba(27,67,50,0.08)]"
                >
                    <div className="flex justify-between items-start mb-4">
                        <span className={`${m.iconBg} ${m.iconColor} p-2 rounded-lg`}>
                            <Icon name={m.icon} />
                        </span>
                        <span className={`${m.deltaColor} text-sm font-semibold flex items-center gap-0.5`}>
                            {m.delta}
                            {!m.noTrendIcon && <Icon name="trending_up" className="text-[16px]" />}
                        </span>
                    </div>
                    <p className="text-stone-500 text-xs uppercase tracking-wide font-semibold">
                        {m.label}
                    </p>
                    <p className="text-2xl font-semibold mt-1">{m.value}</p>
                </div>
            ))}
        </div>
        </>
)}