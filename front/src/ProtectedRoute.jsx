import { Navigate, useLocation } from 'react-router';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    // if (SKIP_AUTH) {
    //     return children;
    // }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-slate-400 text-sm">
                Cargando...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
