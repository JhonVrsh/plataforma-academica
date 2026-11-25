import { formatoNota } from '../utils/validaciones';

// Tarjetas con indicadores calculados a partir de los registros que devolvió GET /api/calificaciones.
export default function TarjetasResumen({ calificaciones }) {
  const total = calificaciones.length;
  const aprobados = calificaciones.filter((c) => c.estado === 'APROBADO').length;
  const promedioGeneral = total
    ? formatoNota(calificaciones.reduce((suma, c) => suma + c.promedio, 0) / total)
    : '—';

  const tarjetas = [
    { titulo: 'Registros', valor: total },
    { titulo: 'Aprobados', valor: aprobados, variante: 'exito' },
    { titulo: 'Reprobados', valor: total - aprobados, variante: 'peligro' },
    { titulo: 'Promedio general', valor: promedioGeneral },
  ];

  return (
    <section className="resumen" aria-label="Resumen de calificaciones">
      {tarjetas.map((tarjeta) => (
        <article
          key={tarjeta.titulo}
          className={`tarjeta${tarjeta.variante ? ` tarjeta--${tarjeta.variante}` : ''}`}
        >
          <p className="tarjeta__titulo">{tarjeta.titulo}</p>
          <p className="tarjeta__valor">{tarjeta.valor}</p>
        </article>
      ))}
    </section>
  );
}
