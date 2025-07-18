module.exports = (sequelize, type) => {
  return sequelize.define('beacons', {
    id: {
      type: type.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    beaconId: type.BIGINT,
    serialNumber: {
      type: type.STRING,
      allowNull: false,
      unique: true
    },
    date: {
      type: type.DATEONLY,
      allowNull: false
    },
    longitude: {
      type: type.DOUBLE,
      allowNull: false
    },
    latitude: {
      type: type.DOUBLE,
      allowNull: false
    },
    estadoBeacon: type.STRING,
    observaciones: type.TEXT
  }, {
    timestamps: false,
    tableName: 'beacons'
  });
};
