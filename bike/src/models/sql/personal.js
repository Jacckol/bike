module.exports = (sequelize, type) => {
  return sequelize.define('personal', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: type.STRING,
      allowNull: false
    },
    correo: {
      type: type.STRING,
      allowNull: false,
      unique: true
    },
    telefono: {
      type: type.STRING,
      allowNull: false
    },
    fechaNacimiento: {
      type: type.DATE,
      allowNull: false
    },
    estado: {
      type: type.STRING,
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'personal'
  });
};
