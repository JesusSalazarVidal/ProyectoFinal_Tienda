const mongoose = require('mongoose');

const { Schema } = mongoose;

const productoSchema = new Schema({
    nombre: {type: String},
    precio: {type: String},
    cantidad: {type: String},
    categoria: {type: String},
    descripcion:{type: String},
    path: {type: String},
    
    created_at: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('producto', productoSchema);