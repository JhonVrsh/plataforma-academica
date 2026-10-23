// Endpoints expuestos al cliente para el recurso /api/calificaciones.
const { Router } = require('express');
const controller = require('../controllers/calificacion.controller');

const router = Router();

router.get('/', controller.listar);
router.get('/:id', controller.obtenerPorId);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

module.exports = router;
