export const LineaTiempo = ({prospecto}) => {

    const eventos = prospecto?.eventos || [];

    const findEvento = (nombre) => eventos.find((e) => e.evento === nombre);

    const eventoAlta = findEvento('Alta de prospecto');
    const isAltaDone = Boolean(eventoAlta);

    const eventoAsignado = findEvento('Ejecutivo asignado');
    const isAsignadoDone = Boolean(eventoAsignado || prospecto?.assignedTo);

    const eventoConclusion = findEvento('Conclusión');
    const isConclusionDone = Boolean(eventoConclusion);
    const eventosSeguimiento = eventos.filter(
        (e) => e.evento !== 'Alta de prospecto' && e.evento !== 'Ejecutivo asignado' && e.evento !== 'Conclusión'
    );

    const ultimoSeguimiento = [...eventosSeguimiento].sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
    )[0] ?? eventos.at(-1);
        
    const isEvaluacionDone = isConclusionDone;
    const isEvaluacionInProgress = !isConclusionDone && eventosSeguimiento.length > 0;

    const formatDate = (fechaStr) => {
        if (!fechaStr) return '';
        return new Date(fechaStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }; 

    return (
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-lg flex flex-col hover:shadow-xl transition-shadow duration-300">
            <div className="relative min-h-[300px] flex flex-col justify-between py-2 before:content-[''] before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-[1px] before:bg-slate-100">
                <div className="relative pl-10">
                    <div className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${isAltaDone ? 'bg-emerald-500' : 'bg-slate-100'}`}>
                        {isAltaDone ? (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                        ) : null}
                    </div>
                    <p className={`text-sm font-medium ${isAltaDone ? 'text-slate-900' : 'text-slate-400'}`}>
                        Alta de prospecto
                    </p>
                    <p className={`text-xs mt-0.5 ${isAltaDone ? 'text-slate-500' : 'text-slate-300'}`}>
                        {isAltaDone 
                        ? `${formatDate(eventoAlta?.fecha || prospecto?.createdAt)} • ${eventoAlta.registerByName || 'sistema'}.`
                        : 'Pendiente'}
                    </p>
                </div>

                <div className="relative pl-10">
                    <div className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${isAsignadoDone ? 'bg-emerald-500' : 'bg-slate-100'}`}>
                        {isAsignadoDone ? (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                        ) : null}
                    </div>
                    <p className={`text-sm font-medium ${isAsignadoDone ? 'text-slate-900' : 'text-slate-400'}`}>
                        Ejecutivo asignado
                    </p>
                    <p className={`text-xs mt-0.5 ${isAsignadoDone ? 'text-slate-500' : 'text-slate-300'}`}>
                        {isAsignadoDone 
                        ? `${formatDate(eventoAsignado?.fecha || prospecto?.updatedAt)} • ${prospecto?.assignedTo?.firstName || 'ejecutivo'}.`
                        : 'Sin asignación'}
                    </p>
                </div>

                <div className="relative pl-10">
                    {isEvaluacionDone ? (
                        <div className="absolute left-0 top-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center ring-4 ring-white">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    ) : isEvaluacionInProgress ? (
                        <div className="absolute left-0 top-0 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center ring-4 ring-white shadow-md">
                            <span className="w-2 h-2 rounded-full bg-white"></span>
                        </div>
                    ) : (
                        <div className="absolute left-0 top-0 w-6 h-6 bg-slate-100 rounded-full ring-4 ring-white"></div>
                    )}
                    <p className={`text-sm font-medium ${isEvaluacionDone || isEvaluacionInProgress ? 'text-slate-900' : 'text-slate-400'}`}>
                        Evaluación
                    </p>
                    <p className={`text-xs mt-0.5 ${isEvaluacionDone || isEvaluacionInProgress ? 'text-slate-500' : 'text-slate-300'}`}>
                        {isEvaluacionInProgress
                        ? `${formatDate(ultimoSeguimiento?.fecha)} • ${ultimoSeguimiento?.evento}${ultimoSeguimiento?.descripcion ? ` (${ultimoSeguimiento.descripcion})` : ''}`
                        : isEvaluacionDone
                        ? 'Etapa de evaluación concluida'
                        : 'Pendiente de inicio'}
                    </p>
                </div>

                <div className="relative pl-10">
                    <div className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${isConclusionDone ? 'bg-emerald-500' : 'bg-slate-100'}`}>
                        {isConclusionDone && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                        )}
                    </div>
                    <p className={`text-sm font-medium ${isConclusionDone ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                        Conclusión
                    </p>
                    <p className={`text-xs mt-0.5 ${isConclusionDone ? 'text-slate-500' : 'text-slate-300'}`}>
                        {isConclusionDone 
                        ? `${formatDate(eventoConclusion?.fecha)} • Prospecto dictaminado`
                        : prospecto?.dateControl 
                        ? `Estimado: ${formatDate(prospecto.dateControl)}` 
                        : 'Sin fecha estimada'}
                    </p>
                </div>

            </div>
        </div>
)};