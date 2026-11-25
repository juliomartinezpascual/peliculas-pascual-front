import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { login, isAuthenticated, booting } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    if (!booting && isAuthenticated) {
        return <Navigate to={location.state?.from || "/generos"} replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSaving(true);
        try {
            await login(email.trim(), password);
            navigate(location.state?.from || "/generos", { replace: true });
        } catch (err) {
            setError(err.message || "No se pudo iniciar sesión");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="row justify-content-center py-5">
            <div className="col-12 col-md-6 col-lg-4">
                <div className="card shadow-sm border-0">
                    <div className="card-body p-4">
                        <h2 className="h4 mb-1 text-primary">
                            <i className="bi bi-box-arrow-in-right me-2"></i>Iniciar sesión
                        </h2>
                        <p className="text-muted small mb-4">
                            Accede al backoffice de Pelis Pascualinas.
                        </p>

                        {location.state?.from === "expired" && (
                            <div className="alert alert-warning py-2">
                                Tu sesión expiró. Vuelve a iniciar sesión.
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-danger py-2 d-flex align-items-center">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="login-email" className="form-label fw-semibold">
                                    Email
                                </label>
                                <input
                                    id="login-email"
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                    disabled={saving}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="login-password" className="form-label fw-semibold">
                                    Contraseña
                                </label>
                                <input
                                    id="login-password"
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    autoComplete="current-password"
                                    disabled={saving}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-100 d-flex justify-content-center align-items-center gap-2"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm"></span>
                                        Entrando...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-unlock"></i>
                                        Entrar
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-center small text-muted mt-3 mb-0">
                            ¿No tienes cuenta?{" "}
                            <Link to="/register">Regístrate como operario</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
