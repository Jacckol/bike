module.exports = (sequelize, type) => {
  return sequelize.define('bicicletas_inventario', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    marca: {
      type: type.STRING,
      allowNull: false
    },
    modelo: {
      type: type.STRING,
      allowNull: false
    },
    color: {
      type: type.STRING,
      allowNull: false
    },
    cantidad: {
      type: type.INTEGER,
      allowNull: false
    },
    ubicacion: {
      type: type.STRING,
      allowNull: false
    },
    estado: {
      type: type.ENUM('nuevo', 'usado', 'mantenimiento', 'retirado'),
      allowNull: false
    },
    fechaActualizacion: {
      type: type.DATE,
      defaultValue: type.NOW
    }
  }, {
    timestamps: false,
    tableName: 'bicicletas_inventario',
    indexes: [
      {
        name: 'inv_unico',
        unique: true,
        fields: ['marca', 'modelo', 'color']
      }
    ]
  });
};

