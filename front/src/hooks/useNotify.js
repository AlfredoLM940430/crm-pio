import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';

const SOCKET_URL = 'http://localhost:4320'; 

export const useNotify = (queryClient) => {
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const socket = io(SOCKET_URL, {
            transports: ['websocket'],
            auth: { token }
        });

        const addNotification = (nuevaNotificacion) => {
            queryClient.setQueryData(['notifications'], (oldData = []) => {
                const existe = oldData.some(item => item._id === nuevaNotificacion._id);
                if (existe) return oldData;
                return [nuevaNotificacion, ...oldData];
            });
        };

        socket.on('prospecto:creado', (data) => {
            queryClient.invalidateQueries({ queryKey: ["metrics"] });
            queryClient.invalidateQueries({ queryKey: ["semaforo"] });
            queryClient.invalidateQueries({ queryKey: ["referal-source"] });
            queryClient.invalidateQueries({ queryKey: ["recent-activity"] });
            queryClient.invalidateQueries({ queryKey: ["prospectos"] });
            queryClient.invalidateQueries({ 
                queryKey: ["graphic"],
                refetchType: 'active'
            });

            toast.success(data.mensaje, {
                duration: 3000,
                position: 'top-right',
                icon: '✨',
            });
            //addNotification(data);
        });
        
        socket.on('nuevo:evento', () => {
            queryClient.invalidateQueries({ queryKey: ["metrics"] });
            queryClient.invalidateQueries({ queryKey: ["semaforo"] });
            queryClient.invalidateQueries({ queryKey: ["referal-source"] });
            queryClient.invalidateQueries({ queryKey: ["recent-activity"] });
            queryClient.invalidateQueries({ queryKey: ["prospectos"] });
            queryClient.invalidateQueries({ 
                queryKey: ["graphic"],
                refetchType: 'active'
            });
        });

        socket.on('alerta-prospecto-inactivo', (notificacionBD) => {
            toast.success(notificacionBD.mensaje || 'Prospecto inactivo detectado', {
                duration: 3000,
                position: 'top-right',
                icon: '🔔',
            });
    
            addNotification(notificacionBD);
        });

        socket.on('connect_error', (err) => {
            console.error('Error de autenticación Socket.io:', err.message);
        });

        return () => {
            socket.off('prospecto:creado');
            socket.off('alerta-prospecto-inactivo');
            socket.disconnect();
        };
    }, [queryClient]);
};