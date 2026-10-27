export default function Media() {
    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Media</h2>
                <button className="btn btn-primary">
                    <i className="bi bi-plus-circle me-1"></i> Nueva Película / Serie
                </button>
            </div>
            <div className="card shadow-sm">
                <div className="card-body">
                    <p className="text-muted">Listado y administración de producciones multimedia (películas, series y otros).</p>
                </div>
            </div>
        </div>
    );
}
