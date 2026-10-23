// Orquestadores HTTP: traducen la petición al servicio y fijan el código de estado.
const service = require('../services/calificacion.service');

async function listar(req, res) {
  res.status(200).json(await service.listar());
}

async function obtenerPorId(req, res) {
  res.status(200).json(await service.obtenerPorId(req.params.id));
}

async function crear(req, res) {
  res.status(201).json(await service.crear(req.body));
}

async function actualizar(req, res) {
  res.status(200).json(await service.actualizar(req.params.id, req.body));
}

async function eliminar(req, res) {
  await service.eliminar(req.params.id);
  res.status(204).end();
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
