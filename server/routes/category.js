const express = require('express');
const _ = require('underscore');

const Category = require('../models/category');
const { verificaToken, verificaAdminRole } = require('../milddlewares/autenticacion');

const app = express();

// Obtengo todos los users
app.get('/categories', verificaToken, function (req, res) {

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let lim = req.query.lim || 10;
  lim = Number(lim);

  Category.find({ status: true })
    .sort({ name: 'desc'})
    .populate('user', 'name email')
    .skip(desde)
    .limit(lim)
    .exec((err, categoriesDB) => {

      if (err) {
        return res.status(400).json({
          ok: false,
          message: err
        });
      }

      Category.countDocuments({ status: true }, (error, conteo) => {

        if (error) {
          return res.status(400).json({
            ok: false,
            message: err
          });
        }

        res.json({
          ok: true,
          categorias: categoriesDB,
          total: conteo
        });

      });


    });

});

// Obtengo un usuario
app.get('/categories/:id', verificaToken, function (req, res) {

  let id = req.params.id;

  Category.findById({ '_id': id })
      .populate('user')
      .exec(( err, categoryDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        message: err
      });
    }

    if (!categoryDB) {
      return res.status(400).json({
        ok: false,
        error: {
          message: 'La Categoría que intenta consultar no existe en la BD'
        }
      });
    }
    
    res.json({
      ok: true,
      categoria: categoryDB
    });
  });


});

// Almaceno/posteo uun usuario
app.post('/categories', [verificaToken, verificaAdminRole], function (req, res) {

  let body = req.body;

  let categoria = new Category({
    name: body.name,
    user: body.user,
    status: body.status
  });

  categoria.save((err, categoryDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        message: err
      });
    }

    res.json({
      ok: true,
      categoria: categoryDB
    });

  });

});

// Actualizo un usuario
app.put('/categories/:id', [verificaToken, verificaAdminRole], function (req, res) {
  let id = req.params.id;
  let body = _.pick(req.body, ['name', 'user', 'status']);

  Category.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoryDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        message: err
      });
    }

    res.json({
      ok: true,
      categoria_actualizada: categoryDB
    });

  });

});

// Elimino un usuario (actualizar el estado)
app.delete('/categories/:id', [verificaToken, verificaAdminRole], function (req, res) {
  let id = req.params.id;

  let changeState = {
    status: false
  };

  Category.findByIdAndUpdate(id, changeState, { new: true }, (err, categoryDeleted) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        message: err
      });
    }

    if (categoryDeleted === null) {
      return res.status(400).json({
        ok: false,
        error: {
          message: 'La categoría que intenta eliminar no existe en la BD'
        }
      });
    }

    res.json({
      ok: true,
      categoria_eliminada: categoryDeleted
    });

  });


});

module.exports = app;