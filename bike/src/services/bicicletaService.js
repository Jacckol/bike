const { Bicicleta } = require('../database/dataBase.orm');
const { bicicletaModel } = require('../database/dataBaseMongose');

const crearBicicleta = async (data) => {
  const dataSql = {
    modelo: data.modelo,
    marca: data.marca,
    serial: data.serial,
    estado: data.estado || 'disponible',
    precioHora: data.precioHora,
  };

  const dataMongo = {
    caracteristicas: data.caracteristicas || {},
    mantenimientos: data.mantenimientos || [],
    fechaRegistro: data.fechaRegistro || new Date(),
    idBicicletaSql: null,
  };

  // Validar serial duplicado en SQL
  const existeSerial = await Bicicleta.findOne({ where: { serial: dataSql.serial } });
  if (existeSerial) {
    const error = new Error('El serial ya está en uso');
    error.statusCode = 400;
    throw error;
  }

  const nueva = await Bicicleta.create(dataSql);

  dataMongo.idBicicletaSql = nueva.idBicicleta.toString();

  await bicicletaModel.create(dataMongo);

  return {
    sql: nueva.get({ plain: true }),
    mongo: dataMongo
  };
};

const obtenerTodas = async () => {
  const bicicletasSQL = await Bicicleta.findAll();
  const bicicletasCompletas = await Promise.all(
    bicicletasSQL.map(async (biciSql) => {
      const mongoDoc = await bicicletaModel.findOne({
        idBicicletaSql: biciSql.idBicicleta.toString()
      }).lean();

      return {
        ...biciSql.get({ plain: true }),
        mongo: mongoDoc || {}
      };
    })
  );
  return bicicletasCompletas;
};


const obtenerPorId = async (id) => {
  const biciSql = await Bicicleta.findByPk(id);
  if (!biciSql) return null;
  const mongoDoc = await bicicletaModel.findOne({
    idBicicletaSql: id.toString()
  }).lean();
  return {
    ...biciSql.get({ plain: true }),
    mongo: mongoDoc || {}
  };
};


const actualizarBicicleta = async (id, datos) => {
  const bicicleta = await Bicicleta.findByPk(id);
  if (!bicicleta) {
    const error = new Error('Bicicleta no encontrada');
    error.statusCode = 404;
    throw error;
  }

  if (datos.serial && datos.serial !== bicicleta.serial) {
    const existente = await Bicicleta.findOne({ where: { serial: datos.serial } });
    if (existente) {
      const error = new Error('El serial ya está en uso por otra bicicleta');
      error.statusCode = 400;
      throw error;
    }
  }

  const dataSql = {
    modelo: datos.modelo,
    marca: datos.marca,
    serial: datos.serial,
    estado: datos.estado,
    precioHora: datos.precioHora,
  };

  const dataMongo = {
    caracteristicas: datos.caracteristicas,    
    mantenimientos: datos.mantenimientos,
    fechaRegistro: datos.fechaRegistro,
  };

  await bicicleta.update(
    Object.fromEntries(
      Object.entries(dataSql).filter(([_, v]) => v !== undefined)
    )
  );

  const mongoSet = {};
  for (const [key, value] of Object.entries(dataMongo)) {
    if (value !== undefined) {
      mongoSet[key] = value;
    }
  }
  if (Object.keys(mongoSet).length > 0) {
    await bicicletaModel.updateOne(
      { idBicicletaSql: id.toString() },
      { $set: mongoSet }
    );
  }

  const mongoActualizado = await bicicletaModel.findOne({ idBicicletaSql: id.toString() }).lean();

  return {
    ...bicicleta.get({ plain: true }),
    mongo: mongoActualizado || {}
  };
};


const eliminarBicicleta = async (id) => {
  const bicicleta = await Bicicleta.findByPk(id);
  if (!bicicleta) return null;

  await bicicleta.destroy();
  await bicicletaModel.deleteOne({ idBicicletaSql: id.toString() });

  return bicicleta;
};


module.exports = {
  crearBicicleta,
  obtenerTodas,
  obtenerPorId,
  actualizarBicicleta,
  eliminarBicicleta
};
