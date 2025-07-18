const mongoose = require('mongoose');

const bicicletaSchema = new mongoose.Schema({
    caracteristicas: {
        tipo: String,
        color: String,
        tamanio: String,
        cambios: Number,
        accesorios: [String]
    },
    mantenimientos: [{
        fecha: Date,
        descripcion: String,
        costo: Number
    }],   
    idBicicletaSql: {
        type: String,
        required: true,
        unique: true
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'bicicletas'
});

const Bicicleta = mongoose.model('bicicletas', bicicletaSchema);

module.exports = Bicicleta;
