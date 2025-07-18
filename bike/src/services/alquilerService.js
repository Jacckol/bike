const { Alquiler, Cliente, Bicicleta, Estacion } = require('../database/dataBase.orm');
const { alquilerModel } = require('../database/dataBaseMongose');

// Crear alquiler
const crearAlquiler = async (dataSql, dataMongo = {}) => {
  const { idCliente, idBicicleta, idEstacionInicio, idEstacionFin } = dataSql;

  if (!idCliente || !idBicicleta || !idEstacionInicio || !dataSql.horasAlquiladas || !dataSql.costoTotal) {
    const error = new Error('Faltan datos obligatorios para registrar el alquiler');
    error.statusCode = 400;
    throw error;
  }

  const nuevo = await Alquiler.create(dataSql);

  dataMongo.idAlquilerSql = nuevo.idAlquiler.toString();

  await alquilerModel.create(dataMongo);

  return {
    sql: nuevo.get({ plain: true }),
    mongo: dataMongo
  };
};

// Listar todos
const obtenerTodos = async () => {
  const listaSql = await Alquiler.findAll();
  const listaCompleta = await Promise.all(
    listaSql.map(async (alquiler) => {
      const mongo = await alquilerModel.findOne({
        idAlquilerSql: alquiler.idAlquiler.toString()
      }).lean();

      return {
        ...alquiler.get({ plain: true }),
        mongo: mongo || {}
      };
    })
  );
  return listaCompleta;
};

// Obtener por ID
const obtenerPorId = async (id) => {
  const alquiler = await Alquiler.findByPk(id, {
    include: [
      { model: Cliente, as: 'cliente'},
      { model: Bicicleta, as: 'bicicleta' },
      { model: Estacion, as: 'estacionInicio' },
      { model: Estacion, as: 'estacionFin' }
    ]
  });

  if (!alquiler) return null;

  const mongo = await alquilerModel.findOne({
    idAlquilerSql: id.toString()
  }).lean();

  return {
    ...alquiler.get({ plain: true }),
    mongo: mongo || {}
  };
};

// Actualizar
const actualizarAlquiler = async (id, datos) => {
  const alquiler = await Alquiler.findByPk(id);
  if (!alquiler) {
    const error = new Error('Alquiler no encontrado');
    error.statusCode = 404;
    throw error;
  }

  await alquiler.update(
    Object.fromEntries(
      Object.entries(datos).filter(([_, v]) => v !== undefined && alquiler._options.attributes.includes(_))
    )
  );

  const camposMongo = ['climaInicio', 'notasCliente', 'historialEventos'];
  const dataMongo = {};
  for (const campo of camposMongo) {
    if (datos[campo] !== undefined) {
      dataMongo[campo] = datos[campo];
    }
  }

  if (Object.keys(dataMongo).length > 0) {
    await alquilerModel.updateOne({ idAlquilerSql: id.toString() }, { $set: dataMongo });
  }

  const mongoActualizado = await alquilerModel.findOne({ idAlquilerSql: id.toString() }).lean();

  return {
    ...alquiler.get({ plain: true }),
    mongo: mongoActualizado || {}
  };
};

// Eliminar
const eliminarAlquiler = async (id) => {
  const alquiler = await Alquiler.findByPk(id);
  if (!alquiler) return null;

  await alquiler.destroy();
  await alquilerModel.deleteOne({ idAlquilerSql: id.toString() });

  return alquiler;
};

module.exports = {
  crearAlquiler,
  obtenerTodos,
  obtenerPorId,
  actualizarAlquiler,
  eliminarAlquiler
};
