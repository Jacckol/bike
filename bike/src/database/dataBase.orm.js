const { Sequelize, DataTypes } = require("sequelize");
const { POSTGRESHOST, POSTGRESUSER, POSTGRESPASSWORD, POSTGRESDATABASE, POSTGRESPORT, POSTGRES_URI } = require("../config/key.example");

let sequelize;

if (POSTGRES_URI) {
    sequelize = new Sequelize(POSTGRES_URI, {
        dialect: 'postgres',
        dialectOptions: { charset: 'utf8mb4' },
        pool: { max: 20, min: 5, acquire: 30000, idle: 10000 },
        logging: false
    });
} else {
    sequelize = new Sequelize(POSTGRESDATABASE, POSTGRESUSER, POSTGRESPASSWORD, {
        host: POSTGRESHOST,
        port: POSTGRESPORT,
        dialect: 'postgres',
        dialectOptions: { charset: 'utf8mb4' },
        pool: { max: 20, min: 5, acquire: 30000, idle: 10000 },
        logging: false
    });
}

sequelize.authenticate()
  .then(() => console.log("✅ Conexión establecida con PostgreSQL"))
  .catch(err => console.error("❌ No se pudo conectar a PostgreSQL:", err.message));

const syncOptions = process.env.NODE_ENV === 'development' ? { force: true } : { alter: true };
sequelize.sync(syncOptions)
  .then(() => console.log('✅ Modelos de PostgreSQL sincronizados'))
  .catch(error => console.error('❌ Error al sincronizar PostgreSQL:', error));

const usuarioModel = require('../models/sql/usuario');  
const clienteModel = require('../models/sql/cliente');
const bicicletaModel = require('../models/sql/bicicleta');
const alquilerModel = require('../models/sql/alquiler');
const BeaconModel = require('../models/sql/beacon');
const inventarioModel = require('../models/sql/inventario');
const estacionModel = require('../models/sql/estacion');
const mantenimientoModel = require('../models/sql/mantenimiento');
const personalModel = require('../models/sql/personal');

const Usuario = usuarioModel(sequelize, DataTypes);
const Cliente = clienteModel(sequelize, DataTypes);
const Bicicleta = bicicletaModel(sequelize, DataTypes);
const Alquiler = alquilerModel(sequelize, DataTypes);
const Beacon = BeaconModel(sequelize, DataTypes);
const Inventario = inventarioModel(sequelize, DataTypes);
const Estacion = estacionModel(sequelize, DataTypes);
const Mantenimiento = mantenimientoModel(sequelize, DataTypes);
const Personal = personalModel(sequelize, DataTypes);

// Relaciones
Usuario.belongsTo(Cliente, { foreignKey: 'idCliente' });
Cliente.hasOne(Usuario, { foreignKey: 'idCliente' });

Cliente.hasMany(Alquiler, { foreignKey: 'idCliente' });
Alquiler.belongsTo(Cliente, { foreignKey: 'idCliente', as: 'cliente' });

Bicicleta.hasMany(Alquiler, { foreignKey: 'idBicicleta' });
Alquiler.belongsTo(Bicicleta, { foreignKey: 'idBicicleta', as: 'bicicleta' });

Estacion.hasMany(Mantenimiento);
Mantenimiento.belongsTo(Estacion);

Alquiler.belongsTo(Estacion, { foreignKey: 'idEstacionInicio', as: 'estacionInicio' });
Alquiler.belongsTo(Estacion, { foreignKey: 'idEstacionFin', as: 'estacionFin' });

module.exports = {
    sequelize,
    Usuario,
    Cliente,
    Bicicleta,
    Alquiler,
    Beacon,
    Inventario,
    Estacion,
    Mantenimiento,
    Personal    
};
