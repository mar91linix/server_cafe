const mongoose=require('mongoose');
const uniqueValidator=require('mongoose-unique-validator');
let validRoles={
        values:['USER_ROLE','ADMIN_ROLE'],
        message:'{VALUE} no es un role valido'
    }

let Schema =mongoose.Schema;

let userSchema=new Schema({
    name:{
        type:String,
        require:[true, 'El nombre es requerido.']
    },
    email:{
        type:String,
        unique:true,
        require:[true, 'El email es requerido.']
    },
    password:{
        type:String,
        require:[true, 'El password es requerido.']
    },
    
    role:{
        type:String,
       default:'USER_ROLE',
       enum:validRoles
    },
    img:{
        type:String,
        require:false
    },
    status:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
       default:false
    },
});

userSchema.methods.toJSON = function () {
    let user = this;
    let userObject=user.toObject();
    delete userObject.password;

    return userObject;
};

userSchema.plugin(uniqueValidator,{message:'el {PATH}debe correo debe ser unico'});

module.exports=mongoose.model('user',userSchema);