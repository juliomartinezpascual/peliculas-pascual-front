/**
 * Siempre relativo → Vite proxy (/api → http://localhost:5000).
 * Evita CORS (el backend no permite PATCH en Access-Control-Allow-Methods).
 *
 * Override opcional: VITE_API_URL=http://host:port (solo si el backend ya tiene CORS completo)
 */
const envBase = import.meta.env.VITE_API_URL;
const API_BASE =
    typeof envBase === "string" && envBase.trim().length > 0
        ? envBase.trim().replace(/\/$/, "")
        : "";

const GENEROS_URL = `${API_BASE}/api/v1/generos`;

async function parseError(response) {
    try {
        const text = (await response.text()).trim();
        if (!text) return "Error general";
        const data = JSON.parse(text);
        return data.message || "Error general";
    } catch {
        return "Error general";
    }
}

function parseJsonSafe(text) {
    const trimmed = (text || "").trim();
    if (!trimmed) return null;
    try {
        return JSON.parse(trimmed);
    } catch {
        return null;
    }
}

async function request(url, options = {}) {
    const { headers: customHeaders, body, ...rest } = options;
    const headers = { ...(customHeaders || {}) };

    if (body !== undefined && body !== null) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
        ...rest,
        headers,
        body
    });

    if (!response.ok) {
        throw new Error(await parseError(response));
    }

    // DELETE → 204 sin body
    if (response.status === 204 || response.status === 205) {
        return null;
    }

    const text = await response.text();
    return parseJsonSafe(text);
}

/** GET /api/v1/generos */
export async function listarGeneros() {
    return request(GENEROS_URL);
}

/** GET /api/v1/generos/:id */
export async function obtenerGenero(id) {
    return request(`${GENEROS_URL}/${id}`);
}

/** POST /api/v1/generos/crear */
export async function crearGenero(payload) {
    return request(`${GENEROS_URL}/crear`, {
        method: "POST",
        body: JSON.stringify(payload)
    });
}

/** PUT /api/v1/generos/:id */
export async function actualizarGenero(id, payload) {
    return request(`${GENEROS_URL}/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload)
    });
}

/** PATCH /api/v1/generos/estado/:id */
export async function cambiarEstadoGenero(id, estado) {
    return request(`${GENEROS_URL}/estado/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ estado: Boolean(estado) })
    });
}

/** DELETE /api/v1/generos/:id — 204 sin body */
export async function eliminarGenero(id) {
    return request(`${GENEROS_URL}/${id}`, {
        method: "DELETE"
    });
}
