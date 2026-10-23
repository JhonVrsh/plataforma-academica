// Acceso a datos: únicamente consultas SQL parametrizadas, sin reglas de negocio.
const { run, get, all } = require('../db/database');

const COLUMNAS = 'id, estudiante, curso, corte1, corte2, corte3, promedio, estado, creado_en';

function findAll() {
  return all(`SELECT ${COLUMNAS} FROM calificaciones ORDER BY id`);
}

function findById(id) {
  return get(`SELECT ${COLUMNAS} FROM calificaciones WHERE id = ?`, [id]);
}

function findByEstudianteYCurso(estudiante, curso) {
  return get(
    `SELECT ${COLUMNAS} FROM calificaciones WHERE estudiante = ? AND curso = ?`,
    [estudiante, curso],
  );
}

async function create(c) {
  const { id } = await run(
    `INSERT INTO calificaciones (estudiante, curso, corte1, corte2, corte3, promedio, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [c.estudiante, c.curso, c.corte1, c.corte2, c.corte3, c.promedio, c.estado],
  );
  return findById(id);
}

async function update(id, c) {
  const { changes } = await run(
    `UPDATE calificaciones
        SET estudiante = ?, curso = ?, corte1 = ?, corte2 = ?, corte3 = ?, promedio = ?, estado = ?
      WHERE id = ?`,
    [c.estudiante, c.curso, c.corte1, c.corte2, c.corte3, c.promedio, c.estado, id],
  );
  return changes > 0 ? findById(id) : null;
}

async function remove(id) {
  const { changes } = await run('DELETE FROM calificaciones WHERE id = ?', [id]);
  return changes > 0;
}

module.exports = { findAll, findById, findByEstudianteYCurso, create, update, remove };
