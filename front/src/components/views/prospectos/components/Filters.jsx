import { Icon } from "../../../helpers/Icon";

export const Filters = ({ 
    filterMethod, 
    setFilterMethod, 
    status, 
    setStatus, 
    branch, 
    setBranch, 
    name, 
    setName, 
    handleReset 
}) => {

    const sucursales = [
        { id: "Colotlán", nombre: "Colotlán" },
        { id: "Tlaltenango", nombre: "Tlaltenango" },
        { id: "Huejúcar", nombre: "Huejúcar" },
        { id: "San Martín", nombre: "San Martín" },
        { id: "Bolaños", nombre: "Bolaños" },
        { id: "Río Grande", nombre: "Río Grande" },
        { id: "Teúl", nombre: "Teúl" },
        { id: "Fresnillo Centro", nombre: "Fresnillo Centro" },
        { id: "Villa Guerrero", nombre: "Villa Guerrero" },
        { id: "Puente de Camotlán", nombre: "Puente de Camotlán" },
        { id: "Huejuquilla", nombre: "Huejuquilla" },
        { id: "Jerez", nombre: "Jerez" },
        { id: "Zacatecas", nombre: "Zacatecas" },
        { id: "Monte Escobedo", nombre: "Monte Escobedo" },
        { id: "Fresnillo Plateros", nombre: "Fresnillo Plateros" },
        { id: "Tesistán", nombre: "Tesistán" },
        { id: "Aguascalientes", nombre: "Aguascalientes" },
        { id: "Puerto Vallarta", nombre: "Puerto Vallarta" },
    ];
    
    return (
        <>
            <div className="flex items-center gap-2 mb-3">
                <Icon name="filter" className="text-emerald-900 text-sm" />
                <span className="text-sm font-semibold text-stone-800">Filtros</span>
            </div>

            <div className="bg-white border border-stone-100 shadow-sm rounded-xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-5 sm:items-center sm:justify-between">
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-5 sm:items-center">
                    <div className="flex bg-stone-100 rounded-lg p-1 gap-1 w-full sm:w-auto">
                        {['Estatus', 'Nombre'].map(method => (
                            <button
                                key={method}
                                type="button"
                                onClick={() => setFilterMethod(method)}
                                className={`flex-1 sm:flex-none px-4 py-1.5 text-sm rounded-md transition-all duration-150 ${
                                    filterMethod === method
                                        ? 'bg-white text-emerald-950 shadow-sm font-medium'
                                        : 'text-stone-500 hover:text-stone-700'
                                }`}
                            >
                                {method}
                            </button>
                        ))}
                    </div>

                    {filterMethod === 'Estatus' && (
                        <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-5 sm:items-end animate-fadeIn">
                            <div className="flex flex-col gap-1 w-full sm:w-auto">
                                <label className="text-xs text-stone-500">Estatus</label>
                                <div className="relative">
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="appearance-none bg-white border border-stone-200 rounded-lg pl-4 pr-9 py-2.5 sm:py-2 text-sm text-stone-900 hover:border-stone-300 focus:border-emerald-900 focus:ring-2 focus:ring-emerald-900/10 transition-colors cursor-pointer outline-none w-full sm:min-w-[180px]"
                                    >
                                        <option value="Todos">Todos</option>
                                        <option value="Ejecutivo asignado">Ejecutivo asignado</option>
                                        <option value="Alta de prospecto">Alta de prospecto</option>
                                        <option value="Entrevista en sucursal">Entrevista en sucursal</option>
                                        <option value="Cita programada">Cita programada</option>
                                        <option value="Llamada 1">Llamada 1</option>
                                        <option value="Llamada 2">Llamada 2</option>
                                        <option value="Llamada 3">Llamada 3</option>
                                        <option value="WhatsApp">WhatsApp</option>
                                        <option value="Conclusión">Conclusión</option>
                                    </select>
                                    <Icon
                                        name="arrow_drop_down"
                                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 w-full sm:w-auto">
                                <label className="text-xs text-stone-500">Sucursal</label>
                                <div className="relative">
                                    <select
                                        value={branch}
                                        onChange={(e) => setBranch(e.target.value)}
                                        className="appearance-none bg-white border border-stone-200 rounded-lg pl-4 pr-9 py-2.5 sm:py-2 text-sm text-stone-900 hover:border-stone-300 focus:border-emerald-900 focus:ring-2 focus:ring-emerald-900/10 transition-colors cursor-pointer outline-none w-full sm:min-w-[180px]"
                                    >
                                        <option value="">Todas</option>
                                        {sucursales.map(sucursal => (
                                            <option key={sucursal.id} value={sucursal.id}>
                                                {sucursal.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    <Icon
                                        name="arrow_drop_down"
                                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {filterMethod === 'Nombre' && (
                        <div className="flex flex-col gap-1 w-full sm:w-auto animate-fadeIn">
                            <label className="text-xs text-stone-500">Nombre</label>
                            <div className="relative">
                                <Icon
                                    name="search"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs"
                                />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Buscar por nombre..."
                                    className="bg-white border border-stone-200 rounded-lg pl-9 pr-3 py-2.5 sm:py-2 text-sm text-stone-900 hover:border-stone-300 focus:border-emerald-900 focus:ring-2 focus:ring-emerald-900/10 transition-colors outline-none w-full sm:min-w-[220px]"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end sm:justify-start gap-3 border-t sm:border-t-0 border-stone-100 pt-3 sm:pt-0">
                    <button
                        type="button"
                        className="text-stone-500 hover:text-red-600 hover:bg-red-50 flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg transition-colors"
                        onClick={handleReset}
                    >
                        <Icon name="refresh" className="text-sm" />
                        Reset
                    </button>
                </div>
            </div>
        </>
    );
}