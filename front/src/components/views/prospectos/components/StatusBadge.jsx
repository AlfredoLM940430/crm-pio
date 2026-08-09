const STATUS_DOT_COLORS = {
    'Otros servicios': "bg-amber-400",
    'Solicitar crédito': "bg-emerald-700",
    'Ahorro / inversión': "bg-blue-500",
    'Ingresar como socio': "bg-green-500",
};

export const StatusBadge = ({status}) => {
    return (
        <div className="flex items-center">
            <span
                className={`inline-block h-2 w-2 rounded-full mr-2 ${STATUS_DOT_COLORS[status] || "bg-stone-400"}`}
            />
            <span className="text-sm text-stone-900">{status}</span>
        </div>
)}