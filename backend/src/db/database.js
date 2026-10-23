// Conexión centralizada a SQLite e inicialización controlada de las tablas.
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3');

const DB_FILE = path.resolve(process.env.DB_FILE || './data/app.db');
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error('No se pudo abrir la base de datos:', err.message);
    process.exit(1);
  }
  console.log(`SQLite conectado en ${DB_FILE}`);
});

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS calificaciones (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    estudiante TEXT    NOT NULL,
    curso      TEXT    NOT NULL,
    corte1     REAL    NOT NULL CHECK (corte1 BETWEEN 0 AND 5),
    corte2     REAL    NOT NULL CHECK (corte2 BETWEEN 0 AND 5),
    corte3     REAL    NOT NULL CHECK (corte3 BETWEEN 0 AND 5),
    promedio   REAL    NOT NULL,
    estado     TEXT    NOT NULL CHECK (estado IN ('APROBADO', 'REPROBADO')),
    creado_en  TEXT    NOT NULL DEFAULT (datetime('now')),
    UNIQUE (estudiante, curso)
  );
`;

// Envoltorios con promesas para usar async/await en los repositorios.
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });
}

function initDatabase() {
  return new Promise((resolve, reject) => {
    db.exec(SCHEMA, (err) => (err ? reject(err) : resolve()));
  });
}

module.exports = { db, run, get, all, initDatabase };
