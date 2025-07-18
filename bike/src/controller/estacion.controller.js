const estacionService = require('../services/estacionService');

const crear = async (req, res) => {
  try {
    const estacion = await estacionService.crearEstacion(req.body);
    res.status(201).json({ success: true, data: estacion });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, message: err.message || 'Error interno' });
  }
};

const listar = async (_req, res) => {
  const lista = await estacionService.obtenerTodas();
  res.json({ success: true, data: lista });
};

const obtener = async (req, res) => {
  const estacion = await estacionService.obtenerPorId(req.params.id);
  if (!estacion) return res.status(404).json({ success: false, message: 'No encontrada' });
  res.json({ success: true, data: estacion });
};

const actualizar = async (req, res) => {
  try {
    const estacion = await estacionService.actualizarEstacion(req.params.id, req.body);
    res.json({ success: true, data: estacion });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

const eliminar = async (req, res) => {
  const estacion = await estacionService.eliminarEstacion(req.params.id);
  if (!estacion) return res.status(404).json({ success: false, message: 'No encontrada' });
  res.json({ success: true, message: 'Eliminada correctamente' });
};

module.exports = {
  crear,
  listar,
  obtener,
  actualizar,
  eliminar
};
