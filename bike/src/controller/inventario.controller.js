const service = require('../services/inventarioService');

const crear = async (req, res) => {
  try {
    const { marca, modelo, color, cantidad, ubicacion, estado, observaciones } = req.body;
    const sql = { marca, modelo, color, cantidad, ubicacion, estado, observaciones };
    const mongo = req.body.mongo || {}; 

    const nuevo = await service.crearInventario(sql, mongo);
    res.status(201).json({ success: true, data: nuevo });
  } catch (err) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

const listar = async (req, res) => {
  const lista = await service.obtenerTodos();
  res.json({ success: true, data: lista });
};

const obtener = async (req, res) => {
  const item = await service.obtenerPorId(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'No encontrado' });
  res.json({ success: true, data: item });
};

const actualizar = async (req, res) => {
  const { marca, modelo, color, cantidad, ubicacion, estado, observaciones } = req.body;
  const sql = { marca, modelo, color, cantidad, ubicacion, estado, observaciones };
  const mongo = req.body.mongo || {};

  const actualizado = await service.actualizarInventario(req.params.id, sql, mongo);
  if (!actualizado) return res.status(404).json({ success: false, message: 'No encontrado' });

  res.json({ success: true, data: actualizado });
};

const eliminar = async (req, res) => {
  const eliminado = await service.eliminarInventario(req.params.id);
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
