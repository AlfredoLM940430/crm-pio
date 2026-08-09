export const InformacionPersonal = ({prospecto}) => {
    return (
        <>
            <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Información Personal</h3>
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-4 0h4" />
                    </svg>
                </div>

                <div className="space-y-5">
                    <div>
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Correo electrónico</p>
                        <a href={`mailto:${prospecto?.email}`} className="text-sm font-medium text-slate-800 hover:text-indigo-600 transition-colors">
                            {prospecto?.email}
                        </a>
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Teléfono</p>
                        <p className="text-sm font-medium text-slate-800">{prospecto?.phone}</p>
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Ubicación</p>
                        <p className="text-sm font-medium text-slate-800">{prospecto?.branch}</p>
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Producto de interés</p>
                        <span className="inline-block mt-0.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded-md">
                            {prospecto?.interested_product}
                        </span>
                    </div>
                </div>
            </div>
        </>
)}