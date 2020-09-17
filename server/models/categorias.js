const mongoose = require('mongoose');


let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    name:{
        type:String,
        require:[true, 'El nombre es requerido.']
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'user',
        require: [true, 'El usuario es requerido.']
    },
   
    
    status:{
        type:Boolean,
        default:true
    },
    
});

module.exports = mongoose.model('Categorias',categoriaSchema); 