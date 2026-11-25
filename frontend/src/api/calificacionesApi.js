// Capa de acceso a la API REST del backend. Toda petición HTTP del frontend pasa por aquí.
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');
const RECURSO = `${API_URL}/calificaciones`;

// Error con el código HTTP y los detalles que devuelve el backend ({ error, detalles }).
export class ApiError extends Error {
  constructor(status, mensaje, detalles = []) {
    super(mensaje);
    this.status = status;
    this.detalles = detalles;
  }
}

async function peticion(url, { metodo = 'GET', cuerpo } = {}) {
  const opciones = { method: metodo };
  if (cuerpo !== undefined) {
    opciones.headers = { 'Content-Type': 'application/json' };
    opciones.body = JSON.stringify(cuerpo);
  }

  let respuesta;
  try {
    respuesta = await fetch(url, opciones);
  } catch {
    // fetch solo falla aquí si no hay respuesta: servidor apagado o petición bloqueada por CORS.
    throw new ApiError(0, `No se pudo conectar con el servidor (${API_URL}). Verifica que el backend esté en ejecución.`);
  }

  // 204 No Content no trae cuerpo: intentar leer JSON fallaría.
  const datos = respuesta.status === 204 ? null : await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    throw new ApiError(
      respuesta.status,
      datos?.error || `Error HTTP ${respuesta.status}`,
      Array.isArray(datos?.detalles) ? datos.detalles : [],
    );
  }
  return { status: respuesta.status, datos };
}

export const listarCalificaciones = () => peticion(RECURSO);

export const obtenerCalificacion = (id) => peticion(`${RECURSO}/${id}`);

export const crearCalificacion = (calificacion) =>
  peticion(RECURSO, { metodo: 'POST', cuerpo: calificacion });

export const actualizarCalificacion = (id, calificacion) =>
  peticion(`${RECURSO}/${id}`, { metodo: 'PUT', cuerpo: calificacion });

export const eliminarCalificacion = (id) => peticion(`${RECURSO}/${id}`, { metodo: 'DELETE' });
