const mongoose=require('mongoose');

// const categori = require('./categori');
let validProductos={
    values:['Productos'],
    message:'{VALUE} producto no existe'
}
let Schema =mongoose.Schema;

let productoSchema=new Schema({
    name:{
        type:String,
        require:[true, 'El nombre del producto es requerido.']
    },
    precio_unitario:{
        type:Number,
        require:[true, 'El precio  es requerido.']
    },
    categorias:{
        type:Schema.Types.ObjectId, 
       ref:'categorias'
    },
    
    disponible:{
        type:Boolean,
        require:true,
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

module.exports=mongoose.model('productos',productoSchema);