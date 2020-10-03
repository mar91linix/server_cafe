const express = require('express');
const _ = require('underscore');

const Product = require('../models/product');
const { verificaToken, verificaAdminRole } = require('../milddlewares/autenticacion');

const app = express();

// Obtengo todos los users
app.get('/products', verificaToken, function (req, res) {

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let lim = req.query.lim || 5;
  lim = Number(lim);

  Product.find({ status: true })
    .sort({ name: 'desc'})
    .populate('category', 'name')
    .populate('user', 'name email')
    .skip(desde)
    .limit(lim)
    .exec((err, productsDB) => {

      if (err) {
        return res.status(400).json({
          ok: false,
          message: err
        });
      }

      Product.countDocuments({ status: true }, (error, conteo) => {

        if (error) {
          return res.status(400).json({
            ok: false,
            message: err
          });
        }

        res.json({
          ok: true,
          productos: productsDB,
          total: conteo
        });

      });


    });

});

// Obtengo un producto
app.get('/products/:id', verificaToken, function (req, res) {

  let id = req.params.id;

  Product.findById({'_id': id})
    .populate('category', 'name')
    .populate('user', 'name email')
    .exec(( err, productDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        message: err
      });
    }

    if (!productDB) {
      return res.status(400).json({
        ok: false,
        error: {
          message: 'El Producto que intenta consultar no existe en la BD'
        }
      });
    }
    
    res.json({
      ok: true,
      producto: productDB
    });
  });


});

// Almaceno/posteo un producto
app.post('/products', [verificaToken, verificaAdminRole], function (req, res) {

  let body = req.body;

  let producto = new Product({
    name: body.name,
    unit_price: body.unit_price,
    description: body.description,
    available: body.available,
    category: body.category,
    user: body.user,
    status: body.status
  });

  producto.save((err, productDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        message: err
      });
    }

    res.json({
      ok: true,
      producto: productDB
    });

  });

});

// Actualizo un producto
app.put('/products/:id', [verificaToken, verificaAdminRole], function (req, res) {
  let id = req.params.id;
  let body = _.pick(req.body, ['name', 'unit_price', 'available', 'description', 'category', 'user', 'status']);

  Product.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, productDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        message: err
      });
    }

    res.json({
      ok: true,
      producto_actualizado: productDB
    });

  });

});

// Elimino un producto (actualizar el estado)
app.delete('/products/:id', [verificaToken, verificaAdminRole], function (req, res) {
  let id = req.params.id;

  let changeState = {
    status: false
  };

  Product.findByIdAndUpdate(id, changeState, { new: true }, (err, productDeleted) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        message: err
      });
    }

    if (productDeleted === null) {
      return res.status(400).json({
        ok: false,
        error: {
          message: 'El Producto que intenta eliminar no existe en la BD'
        }
      });
    }

    res.json({
      ok: true,
      producto_eliminado: productDeleted
    });

  });


});

module.exports = app;