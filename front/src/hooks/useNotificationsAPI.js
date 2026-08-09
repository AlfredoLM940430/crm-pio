import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/api';

export const useNotifications = () => {
    const queryClient = useQueryClient();
    
    const { data: notifications = [] } = useQuery({
        queryKey: ['notifications'],
        queryFn: api.getNotifications,
        staleTime: Infinity,
    });

    const markAsRead = (id, userAssignedId, userLevel) => {
        if (["1", "2", "3", "4"].includes(userLevel) || !userAssignedId) {
            removeLocalNotification(id);
        } else {
            deleteMutation.mutate({ id, userAssignedId });
        }
    };

    const removeLocalNotification = (id) => {
        queryClient.setQueryData(['notifications'], (old = []) =>
            old.filter((n) => n._id !== id)
        );
    };

    const deleteMutation = useMutation({
        mutationFn: ({ id }) => api.markNotificationRead(id),
        onSuccess: (_, variables) => {
            removeLocalNotification(variables.id);
        },
    });

    const clearAllMutation = useMutation({
        mutationFn: api.clearAllNotifications,
        onSuccess: () => {
            queryClient.setQueryData(['notifications'], []);
        },
    });

    const clearAll = (id) => {
        const isLocalOnly = ["1", "2", "3", "4"].includes(id);
        const hasBackendId = notifications.some((n) => n.usuarioId);

        if (isLocalOnly || !hasBackendId) {
            queryClient.setQueryData(['notifications'], []);
        } else {
            clearAllMutation.mutate(id); 
        }
    };

    return {
        notifications,
        unreadCount: notifications.filter((n) => !n.leida).length,
        markAsRead,
        clearAll,
    };
};