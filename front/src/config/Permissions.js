export const PERMISOS_POR_NIVEL = {
    1: ['dashboard', 'prospectos', 'eventos', 'agregarProspecto', 'agregarColaborador', 'configuracion', 'seguimientoProspecto'],
    2: ['dashboard', 'prospectos', 'eventos', 'agregarProspecto', 'agregarColaborador', 'configuracion', 'seguimientoProspecto'],
    3: ['dashboard', 'prospectos', 'eventos', 'agregarProspecto', 'agregarColaborador', 'configuracion', 'seguimientoProspecto'],
    4: ['dashboard', 'prospectos', 'eventos', 'agregarProspecto', 'agregarColaborador', 'seguimientoProspecto'],
    5: ['dashboard', 'prospectos', 'eventos', 'agregarProspecto', 'agregarColaborador', 'seguimientoProspecto'],
    6: ['dashboard', 'prospectos', 'eventos', 'agregarProspecto', 'seguimientoProspecto', ],
    7: ['agregarProspecto'],
};

export const puedeVer = (nivel, vista) => {
    const permitidas = PERMISOS_POR_NIVEL[nivel] || [];
    return permitidas.includes(vista);
};

export const vistaPorDefecto = (nivel) => {
    const permitidas = PERMISOS_POR_NIVEL[nivel] || [];
    return permitidas[0] || null;
};