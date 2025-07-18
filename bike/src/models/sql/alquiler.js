// models/alquiler.pg.js
module.exports = (sequelize, type) => {
  return sequelize.define('alquileres', {
    idAlquiler: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    idCliente: {
      type: type.INTEGER,
      allowNull: false,
      references: {
        model: 'clientes',
        key: 'idCliente'
      }
    },
    idBicicleta: {
      type: type.INTEGER,
      allowNull: false,
      references: {
        model: 'bicicletas',
        key: 'idBicicleta'
      }
    },
    idEstacionInicio: {
      type: type.INTEGER,
      allowNull: false,
      references: {
        model: 'estaciones',
        key: 'id'
      }
    },
    idEstacionFin: {
      type: type.INTEGER,
      allowNull: true,
      references: {
        model: 'estaciones',
        key: 'id'
      }
    },
    fechaInicio: {
      type: type.DATE,
      allowNull: false,
      defaultValue: type.NOW
    },
    fechaFin: {
      type: type.DATE
    },
    horasAlquiladas: {
      type: type.INTEGER,
      allowNull: false
    },
    costoTotal: {
      type: type.DECIMAL(10, 2),
      allowNull: false
    },
    estado: {
      type: type.ENUM('activo', 'completado', 'cancelado'),
      defaultValue: 'activo'
    }
  }, {
    timestamps: false,
    tableName: 'alquileres'
  });
};
