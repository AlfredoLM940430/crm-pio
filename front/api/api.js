import crmApi from "./crmApi";

export const api = {
    getMetrics: () => crmApi.get('/metrics').then(res => res.data.data),
    getReferalSource: () => crmApi.get('/referal-source').then(res => res.data.data),
    getSemaforo: () => crmApi.get('/semaforo').then(res => res.data.data),
    getGraphic: () => crmApi.get('/graphic').then(res => res.data.data),
    recentActivity: () => crmApi.get('/recent-activity').then(res => res.data.data),
    getCandidatos: () => crmApi.get('/prospectos').then(res => res.data.data),
    // filterCandidatos: ({ name, status, branch }) => {
    //     const params = new URLSearchParams();
    //     if (name) params.set('name', name);
    //     if (status) params.set('status', status);
    //     if (branch) params.set('branch', branch);
    //     return crmApi.get(`/filter?${params.toString()}`).then(res => res.data.data);
    // },
    getNotifications: () => crmApi.get(`/notificaciones`).then(res => res.data.notifications),

    crearColaborador: (data) => crmApi.post('/nuevo-colaborador', data).then(res => res.data),
    crearProspecto: (data) => crmApi.post('/nuevo-prospecto', data).then(res => res.data),
    
    clearAllNotifications: () => crmApi.patch('/notificaciones/clear-all').then(res => res.data),
    addEvento: ({ prospectoId, data }) => crmApi.patch(`/prospecto/${prospectoId}/eventos`, data).then(res => res.data),
    markNotificationRead: (id) => crmApi.patch(`/notificaciones/${id}/read`).then(res => res.data),
};
