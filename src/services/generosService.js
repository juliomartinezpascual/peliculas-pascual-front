import { apiRequest } from "./api";

const GENEROS_URL = "/api/v1/generos";

/** GET /api/v1/generos — admin, operario */
export async function listarGeneros() {
    return apiRequest(GENEROS_URL);
}

/** GET /api/v1/generos/:id — admin, operario */
export async function obtenerGenero(id) {
    return apiRequest(`${GENEROS_URL}/${id}`);
}

/** POST /api/v1/generos/crear — admin, operario */
export async function crearGenero(payload) {
    return apiRequest(`${GENEROS_URL}/crear`, {
        method: "POST",
        body: JSON.stringify(payload)
    });
}

/** PUT /api/v1/generos/:id — solo admin */
export async function actualizarGenero(id, payload) {
    return apiRequest(`${GENEROS_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
    });
}

/** PATCH /api/v1/generos/estado/:id — solo admin */
export async function cambiarEstadoGenero(id, estado) {
    return apiRequest(`${GENEROS_URL}/estado/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ estado: Boolean(estado) })
    });
}

/** DELETE /api/v1/generos/:id — solo admin (204 sin body) */
export async function eliminarGenero(id) {
    return apiRequest(`${GENEROS_URL}/${id}`, {
        method: "DELETE"
    });
}
