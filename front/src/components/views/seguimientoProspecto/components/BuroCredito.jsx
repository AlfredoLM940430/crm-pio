export const BuroCredito = () => {
    
    // --- Buró de crédito (mock) ---
    const buro = { score: 685, nivel: "Riesgo medio", color: "amber" };

    return (
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Reporte buró de crédito</h3>
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            </div>

            <div className="flex flex-col items-center justify-center flex-grow py-2">
                <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="10" />
                        <circle
                        cx="50" cy="50" r="42" fill="none" stroke="#f59e0b" strokeWidth="10"
                        strokeDasharray={2 * Math.PI * 42}
                        strokeDashoffset={2 * Math.PI * 42 * (1 - buro.score / 850)}
                        strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute text-center">
                        <p className="text-xl font-bold text-slate-900">{buro.score}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">de 850</p>
                    </div>
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
                    {buro.nivel}
                </span>
                <p className="text-[11px] text-slate-400 mt-3 text-center">Última consulta: 14 oct 2023</p>
            </div>
        </div>
)}