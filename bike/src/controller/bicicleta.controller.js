const bicicletaService = require('../services/bicicletaService');

const crear = async (req, res) => {
  try {
    const { modelo, marca, serial, estado, precioHora } = req.body;
    const sqlData = { modelo, marca, serial, estado, precioHora };

    const mongoData = req.body.mongo || {};
    const bicicleta = await bicicletaService.crearBicicleta(sqlData, mongoData);

    res.status(201).json({ success: true, data: bicicleta });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, message: err.message || 'Error interno' });
  }
};

const listar = async (req, res) => {
  const lista = await bicicletaService.obtenerTodas();
  res.json({ success: true, data: lista });
};

const obtener = async (req, res) => {
  const bicicleta = await bicicletaService.obtenerPorId(req.params.id);
  if (!bicicleta) return res.status(404).json({ success: false, message: 'No encontrada' });
  res.json({ success: true, data: bicicleta });
};

const actualizar = async (req, res) => {
  const bicicleta = await bicicletaService.actualizarBicicleta(req.params.id, req.body);
  if (!bicicleta) return res.status(404).json({ success: false, message: 'No encontrada' });
  res.json({ success: true, data: bicicleta });
};

const eliminar = async (req, res) => {
  const bicicleta = await bicicletaService.eliminarBicicleta(req.params.id);
  if (!bicicleta) return res.status(404).json({ success: false, message: 'No encontrada' });
  res.json({ success: true, message: 'Eliminada correctamente' });
};

module.exports = {
  crear,
  listar,
  obtener,
  actualizar,
  eliminar
};
