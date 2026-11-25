import { useState, useEffect } from "react";
import {
    listarGeneros,
    crearGenero,
    actualizarGenero,
    cambiarEstadoGenero,
    eliminarGenero
} from "../services/generosService";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../services/api";

const FORM_INITIAL_STATE = {
    nombre: "",
    estado: true,
    descripcion: ""
};

function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString("es-CO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function closeGeneroModal() {
    const modalElement = document.getElementById("generoModal");
    if (modalElement && window.bootstrap) {
        const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
            modalInstance.hide();
        }
    }
}

export default function Generos() {
    const {
        usuario,
        canCreateGenero,
        canUpdateGenero,
        canToggleGenero,
        canDeleteGenero
    } = useAuth();
    const [generos, setGeneros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [formData, setFormData] = useState(FORM_INITIAL_STATE);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [actionId, setActionId] = useState(null);
    const [filtroTexto, setFiltroTexto] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("Todos");
    const canManageRow = canUpdateGenero || canToggleGenero || canDeleteGenero;

    async function cargarGeneros() {
        setLoading(true);
        setLoadError("");
        try {
            const data = await listarGeneros();
            setGeneros(Array.isArray(data) ? data : []);
        } catch (err) {
            setLoadError(err.message || "Error al listar géneros");
            setGeneros([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let cancelled = false;

        async function init() {
            setLoading(true);
            setLoadError("");
            try {
                const data = await listarGeneros();
                if (!cancelled) {
                    setGeneros(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                if (!cancelled) {
                    setLoadError(err.message || "Error al listar géneros");
                    setGeneros([]);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        init();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "estado" ? value === "true" : value
        }));
    };

    const handleOpenCreateModal = () => {
        setEditingId(null);
        setFormData(FORM_INITIAL_STATE);
        setError("");
    };

    const handleOpenEditModal = (genero) => {
        setEditingId(genero._id);
        setFormData({
            nombre: genero.nombre,
            estado: Boolean(genero.estado),
            descripcion: genero.descripcion || ""
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedNombre = formData.nombre.trim();
        const trimmedDescripcion = formData.descripcion.trim();

        if (!trimmedNombre) {
            setError("El nombre del género es obligatorio.");
            return;
        }

        if (trimmedNombre.length < 2) {
            setError("El nombre debe tener al menos 2 caracteres.");
            return;
        }

        const payload = {
            nombre: trimmedNombre,
            estado: Boolean(formData.estado),
            descripcion: trimmedDescripcion
        };

        setSaving(true);
        setError("");

        try {
            if (editingId) {
                if (!canUpdateGenero) {
                    setError("No tienes permiso para actualizar géneros (se requiere admin).");
                    return;
                }
                const actualizado = await actualizarGenero(editingId, payload);
                if (actualizado?._id) {
                    setGeneros((prev) =>
                        prev.map((g) => (g._id === editingId ? actualizado : g))
                    );
                } else {
                    await cargarGeneros();
                }
            } else {
                if (!canCreateGenero) {
                    setError("No tienes permiso para crear géneros.");
                    return;
                }
                const creado = await crearGenero(payload);
                if (creado?._id) {
                    setGeneros((prev) => [...prev, creado]);
                } else {
                    await cargarGeneros();
                }
            }

            setFormData(FORM_INITIAL_STATE);
            setEditingId(null);
            closeGeneroModal();
        } catch (err) {
            setError(err.message || "Error al guardar el género");
        } finally {
            setSaving(false);
        }
    };

    const handleToggleEstado = async (genero) => {
        if (!canToggleGenero) {
            setLoadError("No tienes permiso para cambiar el estado (se requiere admin).");
            return;
        }
        setActionId(genero._id);
        try {
            const actualizado = await cambiarEstadoGenero(genero._id, !genero.estado);
            if (actualizado?._id) {
                setGeneros((prev) =>
                    prev.map((g) => (g._id === genero._id ? actualizado : g))
                );
            } else {
                await cargarGeneros();
            }
        } catch (err) {
            setLoadError(err.message || "Error al cambiar el estado");
        } finally {
            setActionId(null);
        }
    };

    const handleEliminar = async (genero) => {
        if (!canDeleteGenero) {
            setLoadError("No tienes permiso para eliminar géneros (se requiere admin).");
            return;
        }
        const confirmar = window.confirm(
            `¿Eliminar el género "${genero.nombre}"? Esta acción no se puede deshacer.`
        );
        if (!confirmar) return;

        setActionId(genero._id);
        try {
            await eliminarGenero(genero._id);
            setGeneros((prev) => prev.filter((g) => g._id !== genero._id));
        } catch (err) {
            setLoadError(err.message || "Error al eliminar el género");
        } finally {
            setActionId(null);
        }
    };

    const generosFiltrados = generos.filter((g) => {
        if (!g || !g.nombre) return false;
        const texto = filtroTexto.toLowerCase();
        const coincideTexto =
            g.nombre.toLowerCase().includes(texto) ||
            (g.descripcion || "").toLowerCase().includes(texto);

        const coincideEstado =
            filtroEstado === "Todos" ||
            (filtroEstado === "Activo" && g.estado === true) ||
            (filtroEstado === "Inactivo" && g.estado === false);

        return coincideTexto && coincideEstado;
    });

    return (
        <div className="py-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                <div>
                    <h2 className="mb-1 text-primary">
                        <i className="bi bi-tags-fill me-2"></i>Módulo de Géneros
                    </h2>
                    <p className="text-muted mb-0">
                        Administración de géneros.
                        {usuario?.rol && (
                            <> Sesión: <strong>{usuario.rol}</strong>
                                {!canUpdateGenero && " (solo consulta y creación)"}
                            </>
                        )}
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <button
                        type="button"
                        className="btn btn-outline-secondary d-flex align-items-center gap-2"
                        onClick={cargarGeneros}
                        disabled={loading}
                        title="Recargar lista"
                    >
                        <i className={`bi bi-arrow-clockwise ${loading ? "spinner-border spinner-border-sm" : ""}`}></i>
                        Recargar
                    </button>
                    {canCreateGenero && (
                        <button
                            type="button"
                            className="btn btn-primary d-flex align-items-center gap-2"
                            data-bs-toggle="modal"
                            data-bs-target="#generoModal"
                            onClick={handleOpenCreateModal}
                        >
                            <i className="bi bi-plus-circle"></i> Nuevo Género
                        </button>
                    )}
                </div>
            </div>

            {loadError && (
                <div className="alert alert-danger d-flex align-items-center justify-content-between" role="alert">
                    <div className="d-flex align-items-center">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        <div>
                            <strong>{loadError}</strong>
                            <div className="small mt-1">
                                Backend: {API_BASE || window.location.origin}
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Cerrar"
                        onClick={() => setLoadError("")}
                    ></button>
                </div>
            )}

            <div className="card shadow-sm border-0 mb-4 bg-light">
                <div className="card-body">
                    <div className="row g-3 align-items-center">
                        <div className="col-12 col-md-6">
                            <div className="input-group">
                                <span className="input-group-text bg-white">
                                    <i className="bi bi-search text-muted"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Buscar por nombre o descripción..."
                                    value={filtroTexto}
                                    onChange={(e) => setFiltroTexto(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="input-group">
                                <span className="input-group-text bg-white">
                                    <i className="bi bi-funnel text-muted"></i>
                                </span>
                                <select
                                    className="form-select"
                                    value={filtroEstado}
                                    onChange={(e) => setFiltroEstado(e.target.value)}
                                >
                                    <option value="Todos">Todos los Estados</option>
                                    <option value="Activo">Solo Activos</option>
                                    <option value="Inactivo">Solo Inactivos</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-12 col-md-2 text-md-end text-muted small">
                            Total: <strong>{generosFiltrados.length}</strong> de <strong>{generos.length}</strong>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm border-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-dark">
                            <tr>
                                <th scope="col" style={{ width: "60px" }}>#</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Descripción</th>
                                <th scope="col" style={{ width: "120px" }}>Estado</th>
                                <th scope="col" style={{ width: "170px" }}>Fecha Creación</th>
                                <th scope="col" style={{ width: "170px" }}>Fecha Actualización</th>
                                {(canManageRow || canCreateGenero) && (
                                    <th scope="col" className="text-end" style={{ width: "160px" }}>Acciones</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">
                                        <div className="spinner-border text-primary mb-2" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                        <div>Cargando géneros...</div>
                                    </td>
                                </tr>
                            ) : generosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">
                                        <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                                        No se encontraron géneros registrados o coincidentes.
                                    </td>
                                </tr>
                            ) : (
                                generosFiltrados.map((item, index) => {
                                    const busy = actionId === item._id;
                                    return (
                                        <tr key={item._id}>
                                            <td className="text-muted fw-bold">{index + 1}</td>
                                            <td>
                                                <span className="fw-semibold text-dark">{item.nombre}</span>
                                            </td>
                                            <td>
                                                <span className="text-secondary small">
                                                    {item.descripcion || (
                                                        <em className="text-muted">Sin descripción</em>
                                                    )}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge rounded-pill ${
                                                        item.estado
                                                            ? "bg-success-subtle text-success border border-success"
                                                            : "bg-secondary-subtle text-secondary border border-secondary"
                                                    }`}
                                                >
                                                    {item.estado ? (
                                                        <i className="bi bi-check-circle me-1"></i>
                                                    ) : (
                                                        <i className="bi bi-dash-circle me-1"></i>
                                                    )}
                                                    {item.estado ? "Activo" : "Inactivo"}
                                                </span>
                                            </td>
                                            <td className="small text-muted">
                                                <i className="bi bi-calendar-event me-1"></i>
                                                {formatDate(item.fechaCreacion)}
                                            </td>
                                            <td className="small text-muted">
                                                <i className="bi bi-clock-history me-1"></i>
                                                {formatDate(item.fechaActualizacion)}
                                            </td>
                                            {(canManageRow || canCreateGenero) && (
                                                <td className="text-end">
                                                    {canManageRow ? (
                                                        <div className="btn-group btn-group-sm" role="group">
                                                            {canUpdateGenero && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-primary"
                                                                    title="Editar Género"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#generoModal"
                                                                    onClick={() => handleOpenEditModal(item)}
                                                                    disabled={busy}
                                                                >
                                                                    <i className="bi bi-pencil-square"></i>
                                                                </button>
                                                            )}
                                                            {canToggleGenero && (
                                                                <button
                                                                    type="button"
                                                                    className={`btn ${
                                                                        item.estado
                                                                            ? "btn-outline-warning"
                                                                            : "btn-outline-success"
                                                                    }`}
                                                                    title={item.estado ? "Desactivar" : "Activar"}
                                                                    onClick={() => handleToggleEstado(item)}
                                                                    disabled={busy}
                                                                >
                                                                    {busy ? (
                                                                        <span className="spinner-border spinner-border-sm"></span>
                                                                    ) : (
                                                                        <i
                                                                            className={`bi ${
                                                                                item.estado
                                                                                    ? "bi-toggle-on"
                                                                                    : "bi-toggle-off"
                                                                            }`}
                                                                        ></i>
                                                                    )}
                                                                </button>
                                                            )}
                                                            {canDeleteGenero && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-outline-danger"
                                                                    title="Eliminar Género"
                                                                    onClick={() => handleEliminar(item)}
                                                                    disabled={busy}
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="small text-muted">Solo lectura/alta</span>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div
                className="modal fade"
                id="generoModal"
                tabIndex="-1"
                aria-labelledby="generoModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h5 className="modal-title" id="generoModalLabel">
                                    <i
                                        className={`bi ${
                                            editingId ? "bi-pencil-square" : "bi-plus-circle"
                                        } me-2 text-primary`}
                                    ></i>
                                    {editingId ? "Editar Género" : "Registrar Nuevo Género"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Cerrar"
                                    disabled={saving}
                                ></button>
                            </div>

                            <div className="modal-body">
                                {error && (
                                    <div
                                        className="alert alert-danger d-flex align-items-center py-2"
                                        role="alert"
                                    >
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        <div>{error}</div>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label htmlFor="nombre" className="form-label fw-bold">
                                        Nombre del Género <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombre"
                                        name="nombre"
                                        placeholder="Ej: Acción, Aventura, Terror..."
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                        minLength={2}
                                        disabled={saving}
                                    />
                                    <div className="form-text">
                                        Debe ser un nombre descriptivo y único (mín. 2 caracteres).
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="estado" className="form-label fw-bold">
                                        Estado <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className="form-select"
                                        id="estado"
                                        name="estado"
                                        value={String(formData.estado)}
                                        onChange={handleChange}
                                        required
                                        disabled={saving}
                                    >
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
                                    <div className="form-text">
                                        Los géneros activos estarán disponibles para clasificar
                                        películas y series.
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="descripcion" className="form-label fw-bold">
                                        Descripción
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="descripcion"
                                        name="descripcion"
                                        rows="3"
                                        placeholder="Breve descripción de las características del género..."
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        disabled={saving}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    disabled={saving}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary d-flex align-items-center gap-1"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm"></span>
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-save me-1"></i>
                                            {editingId ? "Actualizar Género" : "Guardar Género"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
