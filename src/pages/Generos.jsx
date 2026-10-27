import { useState, useEffect } from "react";

const STORAGE_KEY = "pelis_pascual_generos";

const INITIAL_GENEROS = [
    {
        id: 1,
        nombre: "Acción",
        estado: "Activo",
        descripcion: "Películas con alto impacto, persecuciones, combates y ritmo acelerado.",
        fechaCreacion: "2026-01-10 10:00:00",
        fechaActualizacion: "2026-01-10 10:00:00"
    },
    {
        id: 2,
        nombre: "Aventura",
        estado: "Activo",
        descripcion: "Historias con viajes, exploraciones y situaciones heroicas en lugares exóticos.",
        fechaCreacion: "2026-01-10 10:15:00",
        fechaActualizacion: "2026-01-10 10:15:00"
    },
    {
        id: 3,
        nombre: "Ciencia Ficción",
        estado: "Activo",
        descripcion: "Narrativas basadas en futuros posibles, ciencia, tecnología, el espacio o universos paralelos.",
        fechaCreacion: "2026-01-10 10:30:00",
        fechaActualizacion: "2026-01-10 10:30:00"
    },
    {
        id: 4,
        nombre: "Drama",
        estado: "Activo",
        descripcion: "Enfoque en el desarrollo de personajes y situaciones realistas de conflicto emocional o moral.",
        fechaCreacion: "2026-01-10 10:45:00",
        fechaActualizacion: "2026-01-10 10:45:00"
    },
    {
        id: 5,
        nombre: "Terror",
        estado: "Activo",
        descripcion: "Producciones diseñadas para provocar miedo, suspenso, tensión o sobresalto.",
        fechaCreacion: "2026-01-10 11:00:00",
        fechaActualizacion: "2026-01-10 11:00:00"
    }
];

const FORM_INITIAL_STATE = {
    nombre: "",
    estado: "Activo",
    descripcion: ""
};

export default function Generos() {
    const [generos, setGeneros] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (error) {
            console.error("Error al leer géneros de localStorage:", error);
        }
        return INITIAL_GENEROS;
    });

    // Guardar en localStorage cada vez que la lista de géneros cambie
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(generos));
        } catch (error) {
            console.error("Error al guardar géneros en localStorage:", error);
        }
    }, [generos]);

    const [formData, setFormData] = useState(FORM_INITIAL_STATE);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [filtroTexto, setFiltroTexto] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("Todos");

    const formatCurrentDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const seconds = String(now.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOpenCreateModal = () => {
        setEditingId(null);
        setFormData(FORM_INITIAL_STATE);
        setError("");
    };

    const handleOpenEditModal = (genero) => {
        setEditingId(genero.id);
        setFormData({
            nombre: genero.nombre,
            estado: genero.estado,
            descripcion: genero.descripcion
        });
        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedNombre = formData.nombre.trim();

        if (!trimmedNombre) {
            setError("El nombre del género es obligatorio.");
            return;
        }

        // Validar nombre único (ignorando mayúsculas/minúsculas)
        const yaExiste = generos.some(
            (g) => g.nombre.toLowerCase() === trimmedNombre.toLowerCase() && g.id !== editingId
        );

        if (yaExiste) {
            setError("Ya existe un género registrado con este nombre.");
            return;
        }

        const now = formatCurrentDate();

        if (editingId) {
            // Actualizar género
            setGeneros((prev) =>
                prev.map((g) =>
                    g.id === editingId
                        ? {
                              ...g,
                              nombre: trimmedNombre,
                              estado: formData.estado,
                              descripcion: formData.descripcion.trim(),
                              fechaActualizacion: now
                          }
                        : g
                )
            );
        } else {
            // Crear nuevo género
            const nuevoGenero = {
                id: Date.now(),
                nombre: trimmedNombre,
                estado: formData.estado,
                descripcion: formData.descripcion.trim(),
                fechaCreacion: now,
                fechaActualizacion: now
            };
            setGeneros((prev) => [...prev, nuevoGenero]);
        }

        // Reset
        setFormData(FORM_INITIAL_STATE);
        setEditingId(null);
        setError("");

        // Cerrar modal de Bootstrap programáticamente si existe
        const modalElement = document.getElementById("generoModal");
        if (modalElement && window.bootstrap) {
            const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        }
    };

    const handleToggleEstado = (id) => {
        const now = formatCurrentDate();
        setGeneros((prev) =>
            prev.map((g) =>
                g.id === id
                    ? {
                          ...g,
                          estado: g.estado === "Activo" ? "Inactivo" : "Activo",
                          fechaActualizacion: now
                      }
                    : g
            )
        );
    };

    // Filtros
    const generosFiltrados = generos.filter((g) => {
        const coincideTexto =
            g.nombre.toLowerCase().includes(filtroTexto.toLowerCase()) ||
            g.descripcion.toLowerCase().includes(filtroTexto.toLowerCase());
        const coincideEstado = filtroEstado === "Todos" || g.estado === filtroEstado;
        return coincideTexto && coincideEstado;
    });

    return (
        <div className="py-4">
            {/* Header del Módulo */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                <div>
                    <h2 className="mb-1 text-primary">
                        <i className="bi bi-tags-fill me-2"></i>Módulo de Géneros
                    </h2>
                    <p className="text-muted mb-0">
                        Administración, registro y edición de géneros cinematográficos para la aplicación.
                    </p>
                </div>
                <button
                    type="button"
                    className="btn btn-primary d-flex align-items-center gap-2"
                    data-bs-toggle="modal"
                    data-bs-target="#generoModal"
                    onClick={handleOpenCreateModal}
                >
                    <i className="bi bi-plus-circle"></i> Nuevo Género
                </button>
            </div>

            {/* Panel de Filtros y Búsqueda */}
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

            {/* Tabla de Géneros */}
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
                                <th scope="col" className="text-end" style={{ width: "140px" }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {generosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">
                                        <i className="bi bi-inbox fs-2 d-block mb-2"></i>
                                        No se encontraron géneros registrados o coincidentes.
                                    </td>
                                </tr>
                            ) : (
                                generosFiltrados.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="text-muted fw-bold">{index + 1}</td>
                                        <td>
                                            <span className="fw-semibold text-dark">{item.nombre}</span>
                                        </td>
                                        <td>
                                            <span className="text-secondary small">
                                                {item.descripcion || <em className="text-muted">Sin descripción</em>}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className={`badge rounded-pill ${
                                                    item.estado === "Activo"
                                                        ? "bg-success-subtle text-success border border-success"
                                                        : "bg-secondary-subtle text-secondary border border-secondary"
                                                }`}
                                            >
                                                {item.estado === "Activo" ? (
                                                    <i className="bi bi-check-circle me-1"></i>
                                                ) : (
                                                    <i className="bi bi-dash-circle me-1"></i>
                                                )}
                                                {item.estado}
                                            </span>
                                        </td>
                                        <td className="small text-muted">
                                            <i className="bi bi-calendar-event me-1"></i>
                                            {item.fechaCreacion}
                                        </td>
                                        <td className="small text-muted">
                                            <i className="bi bi-clock-history me-1"></i>
                                            {item.fechaActualizacion}
                                        </td>
                                        <td className="text-end">
                                            <div className="btn-group btn-group-sm" role="group">
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary"
                                                    title="Editar Género"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#generoModal"
                                                    onClick={() => handleOpenEditModal(item)}
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                                <button
                                                    type="button"
                                                    className={`btn ${
                                                        item.estado === "Activo"
                                                            ? "btn-outline-warning"
                                                            : "btn-outline-success"
                                                    }`}
                                                    title={item.estado === "Activo" ? "Desactivar" : "Activar"}
                                                    onClick={() => handleToggleEstado(item.id)}
                                                >
                                                    <i
                                                        className={`bi ${
                                                            item.estado === "Activo"
                                                                ? "bi-toggle-on"
                                                                : "bi-toggle-off"
                                                        }`}
                                                    ></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Registro / Edición */}
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
                                    <i className={`bi ${editingId ? "bi-pencil-square" : "bi-plus-circle"} me-2 text-primary`}></i>
                                    {editingId ? "Editar Género" : "Registrar Nuevo Género"}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-toggle="modal"
                                    data-bs-target="#generoModal"
                                    aria-label="Cerrar"
                                ></button>
                            </div>

                            <div className="modal-body">
                                {error && (
                                    <div className="alert alert-danger d-flex align-items-center py-2" role="alert">
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
                                    />
                                    <div className="form-text">
                                        Debe ser un nombre descriptivo y único.
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
                                        value={formData.estado}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="Activo">Activo</option>
                                        <option value="Inactivo">Inactivo</option>
                                    </select>
                                    <div className="form-text">
                                        Los géneros activos estarán disponibles para clasificar películas y series.
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
                                    ></textarea>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary d-flex align-items-center gap-1">
                                    <i className="bi bi-save me-1"></i>
                                    {editingId ? "Actualizar Género" : "Guardar Género"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
