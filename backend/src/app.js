// Configuración de Express, middlewares, rutas y manejo centralizado de errores.
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./db/database');
const calificacionRoutes = require('./routes/calificacion.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS: solo el frontend (que corre en otro puerto) puede consumir la API desde el navegador.
// Se pueden indicar varios orígenes separados por comas en la variable CORS_ORIGIN.
const ORIGENES_PERMITIDOS = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origen) => origen.trim())
  .filter(Boolean);

app.use(cors({
  origin: ORIGENES_PERMITIDOS,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ estado: 'ok' }));
app.use('/api/calificaciones', calificacionRoutes);

// Ruta no encontrada.
app.use((req, res) => {
  res.status(404).json({ error: `Ruta ${req.method} ${req.originalUrl} no encontrada` });
});

// Manejador de errores: Express 5 envía aquí los errores de los controladores async.
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }
  if (err.status) {
    const cuerpo = { error: err.message };
    if (err.detalles) cuerpo.detalles = err.detalles;
    return res.status(err.status).json(cuerpo);
  }
  console.error(err);
  return res.status(500).json({ error: 'Error interno del servidor' });
});

initDatabase()
  .then(() => {
    app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Error inicializando la base de datos:', err.message);
    process.exit(1);
  });

module.exports = app;
