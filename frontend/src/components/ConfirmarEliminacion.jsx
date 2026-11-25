// Confirmación previa antes de enviar DELETE /api/calificaciones/:id.
export default function ConfirmarEliminacion({ calificacion, procesando, onConfirmar, onCancelar }) {
  return (
    <div className="confirmacion">
      <p>
        ¿Seguro que deseas eliminar la calificación <strong>#{calificacion.id}</strong> de{' '}
        <strong>{calificacion.estudiante}</strong> en <strong>{calificacion.curso}</strong>?
      </p>
      <p className="texto-tenue">El registro se borrará de la base de datos SQLite y no se puede deshacer.</p>
      <div className="acciones">
        <button type="button" className="boton boton--secundario" onClick={onCancelar} disabled={procesando} autoFocus>
          Cancelar
        </button>
        <button type="button" className="boton boton--peligro" onClick={onConfirmar} disabled={procesando}>
          {procesando ? 'Eliminando…' : 'Sí, eliminar'}
        </button>
      </div>
    </div>
  );
}
