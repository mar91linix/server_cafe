const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} no es un role válido!'
}

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido.']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es requerido.']
    },
    password: {
        type: String,
        required: [true, 'El password es requerido.']
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    img: {
        type: String, // /images/saf090asgf980sdgf
        required: false
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// Función para ocultar el password del resultado que mostramos al usuario
userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

userSchema.plugin( uniqueValidator, { message: 'El {PATH} debe ser único!' } );

module.exports = mongoose.model('User', userSchema);
