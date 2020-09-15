const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../models/user');

const { verificaToken, verificaAdminRole } = require ('../milddlewares/autentication');


const app = express();

app.get('/usuarios',[verificaToken,verificaAdminRole], function (req, res) {

 
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let lim = req.query.lim|| 5;
  lim = Number(lim);

 User.find ( {status : true}, 'name  email  img  role') 
     .skip ( desde)
      .limit (lim)
      .exec ( (err, usersDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            message:err
          });
        }

        User.countDocuments({ status: true }, (error, conteo ) =>{
          
          if (error) {
            return res.status(400).json({
              ok:false,
              message:err

            });
          }
        });

        res.json({
           ok: true,
           usuarios: usersDB,
          total:'conteo',
        });
      });
    });
    
    // console.log(process.env.PORT);
 
  app.get('/usuarios/:id_user',[verificaToken,verificaAdminRole], function (req, res) {
    let id=req.params.id_user;

    User.findById( id, ( err, userDB) =>{
      if (err) {
        return res.status(400).json({
           ok: false,
           message:err
         });
       }
       if (!userDB) {
        return res.status(400).json({
           ok: false,
           error: {
           message:'el ususario'
          }
         });
       }
  res.json({
      ok: true,
      usuario:userDB
      });
  });
});
  //almaceno/posteola informacion enviada
  app.post('/usuarios/:id',[verificaToken,verificaAdminRole], function (req,res) {
    let body=req.body;
    User.fin
    let usuario=new User({
      name :body.name,
      email: body.email,
      password:bcrypt.hashSync(body.password,10),
      role:body.role,
      img:body.img,
      status:body.status,
      google:body.google,
      });
    usuario.save((err,userDB)=>{
      if (err) {
       return res.status(400).json({
          ok: false,
          message: err
        });
      }
      // userDB.password=null;otra para el codigo no se recomienda
      res.json({
      ok: true,
      usuario:userDB
    });
  });
});

  //actualizo al informacion enviada
  app.put('/usuarios/:id',[verificaToken,verificaAdminRole], function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['email','rol','name','img' , 'password']);
    
    body.password = bcrypt.hashSync(body.password, 10 );

    User.findByIdAndUpdate(id, body, {new:true, runValidators: true, context: 'query'}, (err, userDB) => {
   
        if (err) {
         return res.status(400).json({
            ok: false,
            message:err
          });
        }
        res.json({
          ok:true,
          usuario_actualizado:userDB
        });
    });
  });

  
  //eliminila informacion (actualizada)
  app.delete('/usuarios/:id',[verificaToken,verificaAdminRole], function (req, res) {
    let id=req.params.id;

    let changeState = {
      status: false
    };

    User.findByIdAndUpdate(id, changeState, {new:true}, (err, userDeleted) => {
   
      if (err) {
       return res.status(400).json({
          ok: false,
          message:err
        });
      }
      if (userDeleted === null) {
        return res.status(400).json({
          ok:false,
          error: {
            message: 'el usuario ya fue eliminado de la DB'
          }
        });
      }
      res.json({
      ok:true,
      usuario_eliminado: userDeleted
  });
});

  });
  module.exports = app;