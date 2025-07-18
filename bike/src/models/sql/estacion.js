module.exports = (sequelize, type) => {
  return sequelize.define('estaciones', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: type.STRING,
      allowNull: false
    },
    direccion: {
      type: type.STRING,
      allowNull: false
    },
    capacidad: {
      type: type.INTEGER,
      allowNull: false
    },
   estado: {
  type: type.ENUM('activa', 'inactiva', 'mantenimiento'),
  defaultValue: 'activa'
}
  }, {
    timestamps: false,
    tableName: 'estaciones'
  });
};
