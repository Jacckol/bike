const { Estacion } = require('../database/dataBase.orm');
const{ estacionModel } = require('../database/dataBaseMongose');

// Crear 
const crearEstacion = async (data) => {
  const { nombre, direccion, capacidad, estado, sensores, historialEventos } = data;

  const existe = await Estacion.findOne({ where: { nombre } });
  if (existe) {
    const error = new Error('El nombre ya está en uso');
    error.statusCode = 400;
    throw error;
  }

  const sqlData = await Estacion.create({ nombre, direccion, capacidad, estado });

  const mongoData = {
    estacionIdPostgres: sqlData.id.toString(),
    sensores: sensores || {},
    historialEventos: historialEventos || [{
      fecha: new Date(),
      evento: 'Estación creada'      
    }],
    fechaRegistro: new Date()
  };

  const mongoCreado = await estacionModel.create(mongoData);

  return {
    sql: sqlData.get({ plain: true }),
    mongo: mongoCreado.toObject()
  };
};

// Obtener todas
const obtenerTodas = async () => {
  const estacionesSQL = await Estacion.findAll();
  const estacionesMongo = await estacionModel.find();

  return estacionesSQL.map(estacion => {
    const mongo = estacionesMongo.find(e => e.estacionIdPostgres === estacion.id.toString());
    return {
      ...estacion.get({ plain: true }),
      mongo: mongo || {}
    };
  });
};

// Obtener por ID
const obtenerPorId = async (id) => {
  const sql = await Estacion.findByPk(id);
  if (!sql) return null;
  const mongo = await estacionModel.findOne({ estacionIdPostgres: id.toString() }).lean();
  return {
    ...sql.get({ plain: true }),
    mongo: mongo || {}
  };
};

// Actualizar
const actualizarEstacion = async (id, datos) => {
  const estacion = await Estacion.findByPk(id);
  if (!estacion) {
    const error = new Error('Estación no encontrada');
    error.statusCode = 404;
    throw error;
  }

  if (datos.nombre && datos.nombre !== estacion.nombre) {
    const duplicado = await Estacion.findOne({ where: { nombre: datos.nombre } });
    if (duplicado) {
      const error = new Error('Nombre en uso');
      error.statusCode = 400;
      throw error;
    }
  }

  await estacion.update({
    nombre: datos.nombre,
    direccion: datos.direccion,
    capacidad: datos.capacidad,
    estado: datos.estado
  });

  const mongoUpdate = {};
  if (datos.sensores !== undefined) mongoUpdate.sensores = datos.sensores;
  if (Object.keys(mongoUpdate).length > 0) {
    mongoUpdate.$push = {
      historialEventos: {
        fecha: new Date(),
        evento: 'Actualización'        
      }
    };

    await estacionModel.updateOne(
      { estacionIdPostgres: id.toString() },
      { $set: mongoUpdate }
    );
  }

  const mongo = await estacionModel.findOne({ estacionIdPostgres: id.toString() }).lean();

  return {
    ...estacion.get({ plain: true }),
    mongo: mongo || {}
  };
};

// Eliminar
const eliminarEstacion = async (id) => {
  const estacion = await Estacion.findByPk(id);
  if (!estacion) return null;

  await estacion.destroy();
  await estacionModel.deleteOne({ estacionIdPostgres: id.toString() });

  return estacion;
};

module.exports = {
  crearEstacion,
  obtenerTodas,
  obtenerPorId,
  actualizarEstacion,
  eliminarEstacion
};
