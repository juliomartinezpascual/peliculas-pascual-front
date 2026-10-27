export default function Directores() {
    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Directores</h2>
                <button className="btn btn-primary">
                    <i className="bi bi-plus-circle me-1"></i> Nuevo Director
                </button>
            </div>
            <div className="card shadow-sm">
                <div className="card-body">
                    <p className="text-muted">Listado y administración de directores de películas y series.</p>
                </div>
            </div>
        </div>
    );
}
