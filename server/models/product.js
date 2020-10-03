const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let productSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'El nombre es requerido.']
    },

    unit_price: {
        type: Number, 
        required: [true, 'El precio únitario es necesario']
    },

    description: { 
        type: String, 
        required: false 
    },

    img: { 
        type: String, 
        required: false 
    },

    available: { 
        type: Boolean, 
        required: true, 
        default: true 
    },

    category: { 
        type: Schema.Types.ObjectId, 
        ref: 'Category', 
        required: true 
    },
    
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true 
    },

    status: {
        type: Boolean,
        default: true
    }
});


productSchema.plugin( uniqueValidator, { message: 'El {PATH} debe ser único!' } );

module.exports = mongoose.model('Product', productSchema);