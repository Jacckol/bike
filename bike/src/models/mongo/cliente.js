const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
    direccion: {
        type: String,
        required: false
    },
    telefono: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false,
        lowercase: true
    },
    preferencias: {
        tipoBicicleta: String,
        rutasFrecuentes: [String]
    },
    historialAlquileres: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'alquileres'
    }],
    idClienteSql: {
        type: String,
        required: true,
        unique: true
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'clientes'
});

const Cliente = mongoose.model('clientes', clienteSchema);

module.exports = Cliente;