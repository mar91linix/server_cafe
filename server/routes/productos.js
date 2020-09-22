const express = require('express');
// const bcrypt = require('bcrypt');
const _ = require('underscore');

const Productos = require('../models/productos');

const { verificaToken, verificaAdminRole } = require('../milddlewares/autentication');

const app = express();

app.get('/productos', [verificaToken, verificaAdminRole], function (req, res) {
  
  let desde = req.query.desde || 0;
  desde = Number(desde);

  let lim = req.query.lim || 5;
  lim = Number(lim);

  Productos.find({ status: true })
    .sort({ name: 'desc' })
    .populate('categorias', 'name ')
    .populate('user', 'name email')
    .skip(desde)
    .limit(lim)
    .exec((err, productosDB) => {

      if (err) {
        return res.status(400).json({
          ok: false,
          message: err
        });
      }

      Productos.countDocuments({ status: true }, (error, conteo) => {

        if (error) {
          return res.status(400).json({
            ok: false,
            message: err

          });
        }
        res.json({
          ok: true,
          Productos: productosDB,
          total: conteo,
        });

      });

    });
    
});

// console.log(process.env.PORT);

app.get('/productos/:id_productos', [verificaToken, verificaAdminRole], function (req, res) {
  let id = req.params.id_productos;

  Productos.findById({ '_id': id })
    .populate('categorias', 'name')
    .populate('user', 'name email')
    .exec((err, productosDB) => {

      if (err) {
        return res.status(400).json({
          ok: false,
          message: err
        });
      }
      if (!productosDB) {
        return res.status(400).json({
          ok: false,
          error: {
            message: 'el producto que intenta consultar no existe'
          }

        });

      }
      res.json({
        ok: true,
        productos: productosDB,
      });

    });

});

//almaceno/posteola informacion enviada
app.post('/productos/:id', [verificaToken, verificaAdminRole], function (req, res) {
 
  let body = req.body;
  // Productos.fin
  let productos = new Productos({

    name: body.name,
    precio_unitario: body.precio_unitario,
    categorias: body.categorias,
    disponible: body.disponible,
    user: body.user,
    status: body.status,
  });

  productos.save((err, productosDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: err
      });
    }
    res.json({
      ok: true,
      productos: productosDB,

    });

  });

});


//actualizo al informacion enviada
app.put('/productos/:id', [verificaToken, verificaAdminRole], function (req, res) {
  let id = req.params.id;
  let body = _.pick(req.body, ['categorias', 'user', 'name', 'precio_unitario', 'disponible']);


  Productos.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, productosDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        message: err
      });
    }
    res.json({
      ok: true,
      productos_actualizado: productosDB,

    });
  });

});

//eliminila informacion (actualizada)
app.delete('/productos/:id', [verificaToken, verificaAdminRole], function (req, res) {
  let id = req.params.id;

  let changeState = {
    status: false
  };

  Productos.findByIdAndUpdate(id, changeState, { new: true }, (err, productosDeleted) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        message: err
      });
    }
    if (productosDeleted === null) {
      return res.status(400).json({
        ok: false,
        error: {
          message: 'el producto ya fue eliminado de la DB'
        }
      });
    }
    res.json({
      ok: true,
      productos_eliminado: productosDeleted,

    });


  });


});
module.exports = app;