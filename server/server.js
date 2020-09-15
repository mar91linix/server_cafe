require('./config/config.js');

const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');


const app = express();



mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify',false);

// const userSchema=new Schema ({name})
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 // parse application/json
app.use(bodyParser.json());

//obtengo la informacion 
app.use ( require('./routes/user'));
app.use ( require('./routes/productos'));
app.use ( require('./routes/categorias'));
app.use ( require('./routes/login'));



mongoose.connect('mongodb+srv://admin:admin>@cafedb.ffcia.mongodb.net/test',{useNewUrlParser:true,useUnifiedTopology:true} , (err,res)=>{
  if (err) throw err;
  console.log('DB ONLINE');
});

app.listen(process.env.PORT,()=>{
    console.log('servidor corriendon en le puerto: ');
});
