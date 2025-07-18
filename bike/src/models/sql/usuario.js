module.exports = (sequelize, DataTypes) => {
    return sequelize.define('usuarios', {
        idUsuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cedula: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        nombreCompleto: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rol: {
            type: DataTypes.ENUM('admin', 'personal', 'cliente'),
            defaultValue: 'personal'
        },
        estado: {
            type: DataTypes.ENUM('activo', 'inactivo'),
            defaultValue: 'activo'
        },
        idCliente: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        fechaRegistro: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false,
        tableName: 'usuarios'
    });
};
