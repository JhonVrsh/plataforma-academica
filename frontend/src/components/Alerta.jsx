import { useEffect } from 'react';

const TEXTO_ESTADO = {
  200: 'OK',
  201: 'Created',
  204: 'No Content',
  400: 'Bad Request',
  404: 'Not Found',
  409: 'Conflict',
  500: 'Internal Server Error',
};

// Alerta flotante: verde para respuestas exitosas (2xx) y roja para errores (4xx, 5xx o sin conexión).
export default function Alerta({ alerta, onCerrar }) {
  useEffect(() => {
    if (!alerta) return undefined;
    const temporizador = setTimeout(onCerrar, alerta.tipo === 'exito' ? 5000 : 10000);
    return () => clearTimeout(temporizador);
  }, [alerta, onCerrar]);

  if (!alerta) return null;

  const codigo = alerta.status
    ? `${alerta.status} ${TEXTO_ESTADO[alerta.status] ?? ''}`.trim()
    : 'Sin conexión';

  return (
    <div
      className={`alerta alerta--${alerta.tipo}`}
      role={alerta.tipo === 'error' ? 'alert' : 'status'}
    >
      <span className="alerta__icono" aria-hidden="true">{alerta.tipo === 'exito' ? '✓' : '!'}</span>
      <div className="alerta__contenido">
        <strong className="alerta__codigo">{codigo}</strong>
        <p>{alerta.mensaje}</p>
        {alerta.detalles?.length > 0 && (
          <ul className="alerta__detalles">
            {alerta.detalles.map((detalle) => <li key={detalle}>{detalle}</li>)}
          </ul>
        )}
      </div>
      <button type="button" className="alerta__cerrar" onClick={onCerrar} aria-label="Cerrar alerta">×</button>
    </div>
  );
}
