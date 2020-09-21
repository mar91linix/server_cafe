require('./config/config.js');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const bodyParser = require('body-parser');


const app = express();



mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify',false);

// const userSchema=new Schema ({name})
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 // parse application/json
app.use(bodyParser.json());

//habilitar ruta publicas
app.use( express.static(path.resolve (__dirname, '../public' )));


// console.log ( path.resolve( __dirname + '../public'));
//obtengo la informacion 
app.use ( require('./routes/user'));
app.use ( require('./routes/productos'));
app.use ( require('./routes/categorias'));
app.use ( require('./routes/login'));



// // mongoose.connect('mongodb+srv://admin:admin@cafedb.ffcia.mongodb.net/test',{useNewUrlParser:true,useUnifiedTopology:true} , (err,res)=>{
  mongoose.connect ,(process.env.URLDB , {useNewUrlParser: true, useUnifiedTopology:true}, (err, res) => {
 if (err) throw err;
   console.log('DB ONLINE');
 });

app.listen(process.env.PORT, ()=>{
    console.log('servidor corriendon en el puerto : ',process.env.PORT);
});
