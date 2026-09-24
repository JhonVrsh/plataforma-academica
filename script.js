// Calcula el promedio de cada curso y lo marca como aprobado o reprobado.
const NOTA_MINIMA = 3.0;

document.querySelectorAll('.tabla tbody tr').forEach((fila) => {
  const celdas = fila.querySelectorAll('td');
  const notas = Array.from(celdas)
    .slice(1, 4)
    .map((celda) => parseFloat(celda.textContent));

  const promedio = notas.reduce((suma, nota) => suma + nota, 0) / notas.length;
  const celdaPromedio = fila.querySelector('.promedio');

  celdaPromedio.textContent = promedio.toFixed(1);
  celdaPromedio.classList.add(promedio >= NOTA_MINIMA ? 'aprobado' : 'reprobado');
});

// Saludo según la hora del día.
const hora = new Date().getHours();
let saludo = 'Buenas noches';
if (hora < 12) saludo = 'Buenos días';
else if (hora < 18) saludo = 'Buenas tardes';

document.getElementById('saludo').textContent =
  `${saludo}. Consulta tus cursos, calificaciones y anuncios en un solo lugar.`;
