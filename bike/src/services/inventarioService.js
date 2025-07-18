const { Inventario } = require('../database/dataBase.orm');
const { inventarioModel } = require('../database/dataBaseMongose');
const { Op } = require('sequelize');

const crearInventario = async (data) => {
  // Validar campos obligatorios para SQL
  const requiredFieldsSql = ['marca', 'modelo', 'color', 'cantidad', 'ubicacion', 'estado'];
  for (const field of requiredFieldsSql) {
    if (!data[field]) {
      const error = new Error(`El campo ${field} es obligatorio`);
      error.statusCode = 400;
      throw error;
    }
  }

  // Validar que no exista registro duplicado en SQL
  const existe = await Inventario.findOne({
    where: {
      marca: data.marca,
      modelo: data.modelo,
      color: data.color,
      ubicacion: data.ubicacion
    }
  });
  if (existe) {
    const error = new Error('Ya existe un inventario con esos datos (marca, modelo, color, ubicación)');
    error.statusCode = 400;
    throw error;
  }

  const dataSql = {
    marca: data.marca,
    modelo: data.modelo,
    color: data.color,
    cantidad: data.cantidad,
    ubicacion: data.ubicacion,
    estado: data.estado,
    fechaActualizacion: data.fechaActualizacion || new Date()
  };

  // Crear registro SQL
  const nuevoSql = await Inventario.create(dataSql);

  const dataMongo = {
    idInventarioSql: nuevoSql.id.toString(),
    observaciones: data.observaciones || '',
    historialEstados: data.historialEstados || [],
    notas: data.notas || [],
    fechaActualizacion: data.fechaActualizacion || new Date()
  };

  // Crear registro Mongo
  const nuevoMongo = await inventarioModel.create(dataMongo);

  return { sql: nuevoSql, mongo: nuevoMongo };
};


const obtenerTodos = async () => {
  const listaSql = await Inventario.findAll();

  return await Promise.all(
    listaSql.map(async (item) => {
      const mongo = await inventarioModel.findOne({ idInventarioSql: item.id.toString() }).lean();
      return {
        ...item.get({ plain: true }),
        mongo: mongo || {}
      };
    })
  );
};


const obtenerPorId = async (id) => {
  const sql = await Inventario.findByPk(id);
  if (!sql) return null;

  const mongo = await inventarioModel.findOne({ idInventarioSql: id.toString() }).lean();

  return {
    ...sql.get({ plain: true }),
    mongo: mongo || {}
  };
};


const actualizarInventario = async (id, datos) => {
  const registro = await Inventario.findByPk(id);
  if (!registro) return null;

  const duplicado = await Inventario.findOne({
    where: {
      marca: datos.marca,
      modelo: datos.modelo,
      color: datos.color,
      ubicacion: datos.ubicacion,
      id: { [Op.ne]: id }
    }
  });
  if (duplicado) {
    const error = new Error('Ya existe otro inventario con esos datos (marca, modelo, color, ubicación)');
    error.statusCode = 400;
    throw error;
  }

  const camposSql = ['marca', 'modelo', 'color', 'cantidad', 'ubicacion', 'estado', 'fechaActualizacion'];
  const datosSql = {};
  const datosMongo = {};

  for (const key in datos) {
    if (camposSql.includes(key)) {
      datosSql[key] = datos[key];
    } else {
      datosMongo[key] = datos[key];
    }
  }

  await registro.update(datosSql);

  if (Object.keys(datosMongo).length > 0) {
    await inventarioModel.updateOne(
      { idInventarioSql: id.toString() },
      { $set: datosMongo }
    );
  }

  return registro;
};


const eliminarInventario = async (id) => {
  const registro = await Inventario.findByPk(id);
  if (!registro) return null;

  await registro.destroy();
  await inventarioModel.deleteOne({ idInventarioSql: id.toString() });

  return registro;
};

module.exports = {
  crearInventario,
  obtenerTodos,
  obtenerPorId,
  actualizarInventario,
  eliminarInventario
};
