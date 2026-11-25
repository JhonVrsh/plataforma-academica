import { formatoNota } from '../utils/validaciones';

// Tabla que se renderiza dinámicamente con los registros de la base de datos SQLite.
export default function TablaCalificaciones({ calificaciones, idResaltado, onEditar, onEliminar }) {
  return (
    <div className="tabla-contenedor">
      <table className="tabla">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Estudiante</th>
            <th scope="col">Curso</th>
            <th scope="col" className="numero">Corte 1</th>
            <th scope="col" className="numero">Corte 2</th>
            <th scope="col" className="numero">Corte 3</th>
            <th scope="col" className="numero">Promedio</th>
            <th scope="col">Estado</th>
            <th scope="col"><span className="solo-lector">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {calificaciones.map((c) => (
            <tr key={c.id} className={c.id === idResaltado ? 'fila--resaltada' : undefined}>
              <td className="texto-tenue">#{c.id}</td>
              <td>{c.estudiante}</td>
              <td>{c.curso}</td>
              <td className="numero">{formatoNota(c.corte1)}</td>
              <td className="numero">{formatoNota(c.corte2)}</td>
              <td className="numero">{formatoNota(c.corte3)}</td>
              <td className="numero"><strong>{formatoNota(c.promedio)}</strong></td>
              <td>
                <span className={`insignia insignia--${c.estado.toLowerCase()}`}>{c.estado}</span>
              </td>
              <td>
                <div className="tabla__acciones">
                  <button
                    type="button"
                    className="boton boton--pequeno boton--secundario"
                    onClick={() => onEditar(c)}
                    aria-label={`Editar la calificación de ${c.estudiante} en ${c.curso}`}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="boton boton--pequeno boton--peligro"
                    onClick={() => onEliminar(c)}
                    aria-label={`Eliminar la calificación de ${c.estudiante} en ${c.curso}`}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
