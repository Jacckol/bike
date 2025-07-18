const alquilerService = require('../services/alquilerService');

const crear = async (req, res) => {
  try {
    const alquiler = await alquilerService.crearAlquiler(req.body, req.body.mongo || {});
    res.status(201).json({ success: true, data: alquiler });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

const listar = async (req, res) => {
  const lista = await alquilerService.obtenerTodos();
  res.json({ success: true, data: lista });
};

const obtener = async (req, res) => {
  const data = await alquilerService.obtenerPorId(req.params.id);
  if (!data) return res.status(404).json({ success: false, message: 'No encontrado' });
  res.json({ success: true, data });
};

const actualizar = async (req, res) => {
  try {
    const data = await alquilerService.actualizarAlquiler(req.params.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

const eliminar = async (req, res) => {
  const eliminado = await alquilerService.eliminarAlquiler(req.params.id);
  if (!eliminado) return res.status(404).json({ success: false, message: 'No encontrado' });
  res.json({ success: true, message: 'Eliminado correctamente' });
};

module.exports = {
  crear,
  listar,
  obtener,
  actualizar,
  eliminar
};
