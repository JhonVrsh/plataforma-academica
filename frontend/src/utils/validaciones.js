// Validaciones del lado del cliente: las mismas reglas del backend (y un formato de nota más estricto)
// para no enviar peticiones que el servidor rechazaría con 400.
export const NOTA_MINIMA = 0;
export const NOTA_MAXIMA = 5;
export const NOTA_APROBATORIA = 3;
export const CORTES = ['corte1', 'corte2', 'corte3'];

const PATRON_NOMBRE = /^[\p{L}\s.'-]+$/u;
const PATRON_NUMERO = /^\d+(\.\d+)?$/;
const PATRON_UN_DECIMAL = /^\d+(\.\d)?$/;

// Acepta coma o punto como separador decimal ("4,5" o "4.5").
export const normalizarNota = (texto) => String(texto ?? '').trim().replace(',', '.');

function validarTexto(valor, etiqueta) {
  const texto = valor.trim();
  if (!texto) return `${etiqueta} es obligatorio.`;
  if (texto.length < 3) return 'Debe tener al menos 3 caracteres.';
  return null;
}

function validarNota(valor) {
  const texto = normalizarNota(valor);
  if (!texto) return 'Obligatorio.';
  if (!PATRON_NUMERO.test(texto)) return 'Debe ser un número (ej. 4.5).';
  const nota = Number(texto);
  if (nota < NOTA_MINIMA || nota > NOTA_MAXIMA) return 'Debe estar entre 0.0 y 5.0.';
  if (!PATRON_UN_DECIMAL.test(texto)) return 'Máximo un decimal.';
  return null;
}

// Devuelve un objeto { campo: mensaje } solo con los campos que tienen errores.
export function validarCalificacion(valores) {
  const errores = {};

  const errorEstudiante = validarTexto(valores.estudiante, 'El nombre del estudiante');
  if (errorEstudiante) errores.estudiante = errorEstudiante;
  else if (!PATRON_NOMBRE.test(valores.estudiante.trim())) errores.estudiante = 'Solo se permiten letras y espacios.';

  const errorCurso = validarTexto(valores.curso, 'El curso');
  if (errorCurso) errores.curso = errorCurso;

  CORTES.forEach((campo) => {
    const error = validarNota(valores[campo]);
    if (error) errores[campo] = error;
  });

  return errores;
}

// Cuerpo JSON que espera el backend, a partir de valores ya validados.
export function construirPayload(valores) {
  return {
    estudiante: valores.estudiante.trim(),
    curso: valores.curso.trim(),
    ...Object.fromEntries(CORTES.map((campo) => [campo, Number(normalizarNota(valores[campo]))])),
  };
}

// Modo prueba: envía los datos tal como están para ver cómo responde el servidor (400 Bad Request).
export function construirPayloadSinValidar(valores) {
  const convertir = (valor) => {
    const texto = normalizarNota(valor);
    if (texto === '') return undefined;
    return /^-?\d+(\.\d+)?$/.test(texto) ? Number(texto) : texto;
  };
  return {
    estudiante: valores.estudiante,
    curso: valores.curso,
    ...Object.fromEntries(CORTES.map((campo) => [campo, convertir(valores[campo])])),
  };
}

// Mismo cálculo que hace el backend: promedio redondeado a un decimal.
export function calcularPromedio(valores) {
  if (CORTES.some((campo) => validarNota(valores[campo]))) return null;
  const suma = CORTES.reduce((total, campo) => total + Number(normalizarNota(valores[campo])), 0);
  const promedio = Math.round((suma / CORTES.length) * 10) / 10;
  return { promedio, estado: promedio >= NOTA_APROBATORIA ? 'APROBADO' : 'REPROBADO' };
}

export const formatoNota = (nota) => Number(nota).toFixed(1);
