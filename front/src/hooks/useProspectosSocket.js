import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';

const SOCKET_URL = 'http://localhost:4320'; 

export const useProspectosSocket = (onNuevoCandidato) => {

    const queryClient = useQueryClient();
    
    useEffect(() => {
        const socket = io(SOCKET_URL, {
            transports: ['websocket'],
        });
        
        socket.on('prospecto:creado', (data) => {
            const nivelesExcluidos = ['5', '6'];
            if (!nivelesExcluidos.includes(data.levelID)) {
                const nombreProspecto = data?.nombre || 'Un nuevo prospecto';
                
                toast.success(`¡Nuevo prospecto registrado: ${nombreProspecto}!`, {
                    duration: 5000,
                    position: 'top-right',
                    icon: '🔔',
                });
            }

            queryClient.invalidateQueries({ queryKey: ['metrics'] });
            queryClient.invalidateQueries({ queryKey: ['semaforo'] });
            queryClient.invalidateQueries({ queryKey: ['referal-source'] });

            if (onNuevoCandidato) {
                onNuevoCandidato();
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [queryClient, onNuevoCandidato]);
};