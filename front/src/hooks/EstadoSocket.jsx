import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4320');

export function EstadoSocket() {
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        function onConnect() {
        setIsConnected(true);
        console.log('✅ Socket conectado con ID:', socket.id);
        }

        function onDisconnect() {
        setIsConnected(false);
        console.log('❌ Socket desconectado');
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        };
    }, []);

    return (
        <span className={`px-2 py-1 text-xs rounded ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {isConnected ? '🟢 Tiempo real activo' : '🔴 Sin conexión real-time'}
        </span>
    );
}