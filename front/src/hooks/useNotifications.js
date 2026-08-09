import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useNotifications = () => { 
    const queryClient = useQueryClient();

    const { data: notifications = [] } = useQuery({
        queryKey: ['notifications'],
        initialData: [],
        staleTime: Infinity,
    });

    const markAsRead = (id) => {
        queryClient.setQueryData(['notifications'], (old = []) =>
        old.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        queryClient.setQueryData(['notifications'], (old = []) =>
        old.map((n) => ({ ...n, read: true }))
        );
    };

    const removeNotification = (id) => {
        queryClient.setQueryData(['notifications'], (old = []) =>
        old.filter((n) => n.id !== id)
        );
    };

    const clearAll = () => {
        queryClient.setQueryData(['notifications'], []);
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll
    };
};