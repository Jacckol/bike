const bicicleta = (sequelize, type) => {
    return sequelize.define('bicicletas', {
        idBicicleta: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        modelo: {
            type: type.STRING,
            allowNull: false
        },
        marca: {
            type: type.STRING,
            allowNull: false
        },
        serial: {
            type: type.STRING,
            allowNull: false,
            unique: true
        },
        estado: {
            type: type.ENUM('disponible', 'alquilada', 'mantenimiento', 'retirada'),
            defaultValue: 'disponible'
        },
        precioHora: {
            type: type.DECIMAL(10, 2),
            allowNull: false
        },
        fechaRegistro: {
            type: type.DATE,
            defaultValue: type.NOW
        }
    }, {
        timestamps: false,
        tableName: 'bicicletas'
    });
};

module.exports = bicicleta;