import { useQuery, useQueryClient } from '@tanstack/react-query';
import { lazy, Suspense, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router';
import { api } from '../api/api';
import { AuthProvider } from './AuthContext';
import { SideBar } from './components/SideBar';
import { TopBar } from './components/views/topBar/TopBar';
import RouteGuard from './config/RouterGuard';
import ErrorBoundary from './ErrorBoundary';
import { useNotify } from './hooks/useNotify';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';

const Dashboard = lazy(() => import('./components/views/dashboard/Dashboard'))
const Prospectos = lazy(() => import('./components/views/prospectos/Prospectos'));
const AddProspecto = lazy(() => import('./components/views/addProspecto/AddProspecto'));
const AddColaborador = lazy(() => import('./components/views/addColaborador/AddColaborador'));
const Eventos = lazy(() => import('./components/views/Eventos'));
const Configuracion = lazy(() => import('./components/views/settings/Configuracion'));
const SeguimientoProspecto = lazy(() => import('./components/views/seguimientoProspecto/SeguimientoProspecto'));

function Layout() {

    const queryClient = useQueryClient();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [prospectoSeguimiento, setProspectoSeguimiento] = useState(null);
 
    const navigate = useNavigate();
    const location = useLocation();

    const { data: metrics = [] } = useQuery({
        queryKey: ['metrics'],
        queryFn: api.getMetrics,
    });

    useNotify(queryClient);

    const vistaActual = location.pathname.split('/')[1] || 'dashboard';
    const setVista = (nombre) => navigate(`/${nombre}`);

    return (
        <div className="font-sans text-stone-900 bg-stone-50 min-h-screen">
            <Toaster />
            <SideBar
                setVista={setVista}
                vistaActual={vistaActual}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />
            <TopBar setSidebarOpen={setSidebarOpen} />

            <main className="md:ml-64 pt-16 min-h-screen p-4 sm:p-6 md:p-10 bg-slate-100/60">
                <Suspense fallback={<div className="flex h-full items-center justify-center text-slate-400 text-sm">Cargando vista...</div>}>
                    <ErrorBoundary>
                        <Routes>
                            <Route path="/dashboard" element={
                                <RouteGuard vista="dashboard">
                                    <Dashboard metrics={metrics} />
                                </RouteGuard>
                            } />
                            <Route
                                path="/prospectos"
                                element={
                                    <RouteGuard vista="prospectos">
                                        <Prospectos
                                            metrics={metrics}
                                            setVista={setVista}
                                            setProspectoSeguimiento={setProspectoSeguimiento}
                                        />
                                    </RouteGuard>
                                }
                            />
                            <Route path="/agregarProspecto" element={
                                <RouteGuard vista="agregarProspecto">
                                    <AddProspecto setVista={setVista} setProspectoSeguimiento={setProspectoSeguimiento} />
                                </RouteGuard>
                            } />
                            <Route path="/agregarColaborador" element={
                                <RouteGuard vista="agregarColaborador">
                                    <AddColaborador setVista={setVista} />
                                </RouteGuard>
                            } />
                            <Route path="/eventos" element={
                                <RouteGuard vista="eventos">
                                    <Eventos />
                                </RouteGuard>
                            } />
                            <Route path="/configuracion" element={
                                <RouteGuard vista="configuracion">
                                    <Configuracion />
                                </RouteGuard>
                            } />
                            <Route path="/seguimientoProspecto" element={
                                <RouteGuard vista="seguimientoProspecto">
                                    <SeguimientoProspecto setVista={setVista} prospectoSeguimiento={prospectoSeguimiento} />
                                </RouteGuard>
                            } />
                            <Route path="/" element={
                                <RouteGuard vista="eventos">
                                    <Navigate to="/eventos" replace />
                                </RouteGuard>
                            } />
                            <Route path="*" element={<div className="flex h-full items-center justify-center text-slate-400 text-sm">Selecciona una opción en el menú lateral para comenzar.</div>} />
                        </Routes>
                    </ErrorBoundary>
                </Suspense>
            </main>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </AuthProvider>
    );
}

export default App;
