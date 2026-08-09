import { Navigate } from "react-router";
import { useAuth } from "../AuthContext";
import { puedeVer, vistaPorDefecto } from "./Permissions";

export default function RouteGuard({ vista, children }) {
    const { user } = useAuth();
  
    if (!puedeVer(user?.userLevel, vista)) {
        const destino = vistaPorDefecto(user?.userLevel);
        return destino ? <Navigate to={`/${destino}`} replace /> : <Navigate to="/login" replace />;
    }

    return children;
}