const cliente = (sequelize, type) => {
    return sequelize.define('clientes', {
        idCliente: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cedulaCliente: {
            type: type.STRING,
            allowNull: false,
            unique: true
        },
        nombreCompleto: {
            type: type.STRING,
            allowNull: false
        },
              
        estado: {
            type: type.ENUM('activo', 'inactivo', 'suspendido'),
            defaultValue: 'activo'
        },
        fechaRegistro: {
            type: type.DATE,
            defaultValue: type.NOW
        }
    }, {
        timestamps: false,
        tableName: 'clientes'
    });
};

module.exports = cliente;