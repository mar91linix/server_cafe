const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'El nombre es requerido.']
    },
    
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    status: {
        type: Boolean,
        default: true
    }
});


categorySchema.plugin( uniqueValidator, { message: 'El {PATH} debe ser único!' } );

module.exports = mongoose.model('Category', categorySchema);
