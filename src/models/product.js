const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  nombre: String,
  precio: String,
  descripcion: String
});

module.exports = mongoose.model('product', userSchema);