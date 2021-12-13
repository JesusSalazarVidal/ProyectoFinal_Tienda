const mongoose = require('mongoose');

const { Schema } = mongoose;

const productoSchema = new Schema({
    nombre: {type: String},
    precio: {type: String},
    cantidad: {type: String},
    categoria: {type: String},
    filename: {type: String},
    path: {type: String},
    originalname: {type: String},
    mimetype: {type: String},
    size: { type: Number},
    created_at: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('producto', productoSchema);