const mongoose = require('mongoose')

const ordenSchema = new mongoose.Schema({
    items:[
        {
            _id: false,
            id: String,
            cantidad,
        },

    ],
});

module.exports = mongoose.model('Orden',pedidoSchema);