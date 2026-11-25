import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, booting } = useAuth();
    const location = useLocation();

    if (booting) {
        return (
            <div className="py-5 text-center text-muted">
                <div className="spinner-border text-primary mb-2" role="status">
                    <span className="visually-hidden">Cargando sesión...</span>
                </div>
                <div>Validando sesión...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return children;
}
