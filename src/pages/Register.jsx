import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FORM_INITIAL = {
    nombre: "",
    email: "",
    password: "",
    confirmPassword: ""
};

export default function Register() {
    const { register, isAuthenticated, booting } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState(FORM_INITIAL);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    if (!booting && isAuthenticated) {
        return <Navigate to="/generos" replace />;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (form.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setSaving(true);
        try {
            // Registro público → siempre operario (sin rol admin)
            await register({
                nombre: form.nombre.trim(),
                email: form.email.trim(),
                password: form.password
            });
            navigate("/generos", { replace: true });
        } catch (err) {
            setError(err.message || "No se pudo registrar");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="row justify-content-center py-5">
            <div className="col-12 col-md-6 col-lg-5">
                <div className="card shadow-sm border-0">
                    <div className="card-body p-4">
                        <h2 className="h4 mb-1 text-primary">
                            <i className="bi bi-person-plus me-2"></i>Registro
                        </h2>
                        <p className="text-muted small mb-4">
                            Crea una cuenta de <strong>operario</strong> (consulta y creación).
                            Solo un admin autenticado puede crear otros admins desde el API.
                        </p>

                        {error && (
                            <div className="alert alert-danger py-2 d-flex align-items-center">
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="reg-nombre" className="form-label fw-semibold">
                                    Nombre
                                </label>
                                <input
                                    id="reg-nombre"
                                    name="nombre"
                                    type="text"
                                    className="form-control"
                                    value={form.nombre}
                                    onChange={handleChange}
                                    required
                                    minLength={2}
                                    disabled={saving}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="reg-email" className="form-label fw-semibold">
                                    Email
                                </label>
                                <input
                                    id="reg-email"
                                    name="email"
                                    type="email"
                                    className="form-control"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                    disabled={saving}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="reg-password" className="form-label fw-semibold">
                                    Contraseña
                                </label>
                                <input
                                    id="reg-password"
                                    name="password"
                                    type="password"
                                    className="form-control"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    autoComplete="new-password"
                                    disabled={saving}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="reg-confirm" className="form-label fw-semibold">
                                    Confirmar contraseña
                                </label>
                                <input
                                    id="reg-confirm"
                                    name="confirmPassword"
                                    type="password"
                                    className="form-control"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    autoComplete="new-password"
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
                                        Registrando...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check2-circle"></i>
                                        Crear cuenta
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="text-center small text-muted mt-3 mb-0">
                            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
