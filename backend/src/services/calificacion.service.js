// Reglas de negocio y validaciones: los datos erróneos se rechazan aquí,
// antes de llegar a la base de datos.
const repository = require('../repositories/calificacion.repository');

const NOTA_MINIMA = 0;
const NOTA_MAXIMA = 5;
const NOTA_APROBATORIA = 3.0;

class AppError extends Error {
  constructor(status, message, detalles) {
    super(message);
    this.status = status;
    this.detalles = detalles;
  }
}

function validarId(id) {
  const numero = Number(id);
  if (!Number.isInteger(numero) || numero <= 0) {
    throw new AppError(400, 'El id debe ser un número entero positivo');
  }
  return numero;
}

function validarCalificacion(datos = {}) {
  const errores = [];
  const estudiante = typeof datos.estudiante === 'string' ? datos.estudiante.trim() : '';
  const curso = typeof datos.curso === 'string' ? datos.curso.trim() : '';

  if (estudiante.length < 3) errores.push('estudiante es obligatorio (mínimo 3 caracteres)');
  if (curso.length < 3) errores.push('curso es obligatorio (mínimo 3 caracteres)');

  const notas = {};
  ['corte1', 'corte2', 'corte3'].forEach((campo) => {
    const valor = datos[campo];
    if (typeof valor !== 'number' || Number.isNaN(valor)) {
      errores.push(`${campo} es obligatorio y debe ser numérico`);
    } else if (valor < NOTA_MINIMA || valor > NOTA_MAXIMA) {
      errores.push(`${campo} debe estar entre ${NOTA_MINIMA.toFixed(1)} y ${NOTA_MAXIMA.toFixed(1)}`);
    } else {
      notas[campo] = valor;
    }
  });

  if (errores.length > 0) {
    throw new AppError(400, 'Datos de la calificación inválidos', errores);
  }

  const promedio = Math.round(((notas.corte1 + notas.corte2 + notas.corte3) / 3) * 10) / 10;
  return {
    estudiante,
    curso,
    ...notas,
    promedio,
    estado: promedio >= NOTA_APROBATORIA ? 'APROBADO' : 'REPROBADO',
  };
}

async function asegurarNoDuplicada(calificacion, idActual) {
  const existente = await repository.findByEstudianteYCurso(calificacion.estudiante, calificacion.curso);
  if (existente && existente.id !== idActual) {
    throw new AppError(409, 'El estudiante ya tiene una calificación registrada para ese curso');
  }
}

function listar() {
  return repository.findAll();
}

async function obtenerPorId(id) {
  const calificacion = await repository.findById(validarId(id));
  if (!calificacion) throw new AppError(404, `No existe la calificación con id ${id}`);
  return calificacion;
}

async function crear(datos) {
  const calificacion = validarCalificacion(datos);
  await asegurarNoDuplicada(calificacion);
  return repository.create(calificacion);
}

async function actualizar(id, datos) {
  const idValido = validarId(id);
  const calificacion = validarCalificacion(datos);
  if (!(await repository.findById(idValido))) {
    throw new AppError(404, `No existe la calificación con id ${id}`);
  }
  await asegurarNoDuplicada(calificacion, idValido);
  return repository.update(idValido, calificacion);
}

async function eliminar(id) {
  const eliminado = await repository.remove(validarId(id));
  if (!eliminado) throw new AppError(404, `No existe la calificación con id ${id}`);
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar, AppError };
