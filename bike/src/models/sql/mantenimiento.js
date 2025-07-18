module.exports = (sequelize, type) => {
  return sequelize.define('mantenimientos', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    fechaInicio: {
      type: type.DATE,
      allowNull: false
    },
    tipo: {
      type: type.STRING,
      allowNull: false
    },
    estacionId: {
      type: type.BIGINT,
      allowNull: false,
      references: {
        model: 'estaciones',
        key: 'id'
      }
    },
    descripcion: {
      type: type.TEXT,
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'mantenimientos'
  });
};
