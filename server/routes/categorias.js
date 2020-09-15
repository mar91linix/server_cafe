const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificaToken, verificaAdminRole } = require ('../milddlewares/autentication');
const Categorias = require('../models/user');
const app = express();

app.get('/categorias',[verificaToken,verificaAdminRole], function (req, res) {
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let lim = req.query.lim|| 5;
  lim = Number(lim);

 Categorias.find ( {status : true}, 'name  user') 
     .skip ( desde)
      .limit (lim)
      .exec ( (err, categoriasDB) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            message:err
          });
        }

        Categorias.count({ status: true }, (error, conteo ) =>{
          
          if (error) {
            return res.status(400).json({
              ok:false,
              message:err

            });
          }
        });

        res.json({
           ok: true,
           categorias: categoriasDB,
          total:'conteo',
        });
      });
    });
  app.get('/categorias:id_categorias',[verificaToken,verificaAdminRole], function (req, res) {
    let id=req.params.id_categorias;

    Categorias.findById( id, ( err, categoriasDB) =>{
      if (err) {
        return res.status(400).json({
           ok: false,
           message:err
         });
       }
       if (!categoriasDB) {
        return res.status(400).json({
           ok: false,
           error: {
           message:'la categoria'
          }
         });
       }
  res.json({
      ok: true,
   
     
      });
  });
});
  //almaceno/posteola informacion enviada
  app.post('/categorias/:id' ,[verificaToken,verificaAdminRole], function (req,res) {
    let body=req.body;
    Categorias.fin
    let categorias=new Categorias({
      name :body.name,
      categorias: body.categorias,
      status:body.status,
    });
     categorias.save((err,categoriasDB)=>{
        if (err) {
         return res.status(400).json({
            ok: false,
            message:err
          });
        }
        // userDB.password=null;otra para el codigo no se recomienda
        res.json({
        ok: true,
        categorias: categoriasDB,
       
      });
    });
  });
  



  //actualizo al informacion enviada
  app.put('/categorias/:id',[verificaToken,verificaAdminRole],  function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name' , 'user']);
    
    body.user = bcrypt.hashSync(body.user, 10 );

    Categorias.findByIdAndUpdate(id, body, {new:true, runValidators: true, context: 'query'}, (err, categoriasDB) => {
   
        if (err) {
         return res.status(400).json({
            ok: false,
            message:err
          });
        }
        res.json({
          ok:true,
          categorias_actualizado:categoriasDB,
         
        });
    });
  });

  //eliminila informacion (actualizada)
  app.delete('/categorias/:id',[verificaToken,verificaAdminRole], function (req, res) {
    let id=req.params.id;

    let changeState = {
      status: false
    };

    Categorias.findByIdAndUpdate(id, changeState, {new:true}, (err, categoriasDeleted) => {
   
      if (err) {
       return res.status(400).json({
          ok: false,
          message:err
        });
      }
      if (categoriasDeleted === null) {
        return res.status(400).json({
          ok:false,
          error: {
            message: 'la categoria ya fue eliminado de la DB'
          }
        });
      }
      res.json({
      ok:true,
      categoria_eliminada: categoriasDeleted,
   
  });
});

  });

  module.exports = app;