const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../models/user');
const { verificaToken, verificaAdminRole } = require('../milddlewares/autenticacion');

const app = express();

// Obtengo todos los users
app.get('/users', verificaToken, function (req, res) {

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let lim = req.query.lim || 5;
  lim = Number(lim);

  User.find({ status: true }, 'name email img role')
    .skip(desde)
    .limit(lim)
    .exec((err, usersDB) => {

      if (err) {
        return res.status(400).json({
          ok: false,
          message: err
        });
      }

      User.countDocuments({ status: true }, (error, conteo) => {

        if (error) {
          return res.status(400).json({
            ok: false,
            message: err
          });
        }

        res.json({
          ok: true,
          usuarios: usersDB,
          total: conteo
        });

      });


    });

});

// Obtengo un usuario
app.get('/users/:id_user', verificaToken, function (req, res) {

  let id = req.params.id_user;

  User.findById( id, ( err, userDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        message: err
      });
    }

    if (!userDB) {
      return res.status(400).json({
        ok: false,
        error: {
          message: 'El usuario que intenta consultar no existe en la BD'
        }
      });
    }
    
    res.json({
      ok: true,
      usuario: userDB
    });
  });


});

// Almaceno/posteo uun usuario
app.post('/users', [verificaToken, verificaAdminRole], function (req, res) {

  let body = req.body;

  let usuario = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role,
    img: body.img,
    status: body.status,
    google: body.google
  });

  usuario.save((err, userDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        message: err
      });
    }

    // userDB.password = null;

    res.json({
      ok: true,
      usuario: userDB
    });

  });

});

// Actualizo un usuario
app.put('/users/:id', [verificaToken, verificaAdminRole], function (req, res) {
  let id = req.params.id;
  let body = _.pick(req.body, ['role', 'email', 'name', 'img', 'password']);

  if (body.password) {
    body.password = bcrypt.hashSync(body.password, 10);
  }

  User.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, userDB) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        message: err
      });
    }

    res.json({
      ok: true,
      usuario_actualizado: userDB
    });

  });

});

// Elimino un usuario (actualizar el estado)
app.delete('/users/:id', [verificaToken, verificaAdminRole], function (req, res) {
  let id_usuario = req.params.id;

  let changeState = {
    status: false
  };

  User.findByIdAndUpdate(id_usuario, changeState, { new: true }, (err, userDeleted) => {

    if (err) {
      return res.status(400).json({
        ok: false,
        message: err
      });
    }

    if (userDeleted === null) {
      return res.status(400).json({
        ok: false,
        error: {
          message: 'El usuario que intenta eliminar no existe en la BD'
        }
      });
    }

    res.json({
      ok: true,
      usuario_eliminado: userDeleted
    });

  });


  // Eliminado Físico en la BD
  //
  // User.findByIdAndRemove(id_usuario, (err, userDeleted) => {

  //   if (err) {
  //     return res.status(400).json({
  //       ok: false,
  //       message: err
  //     });
  //   }

  //   if (userDeleted === null) {
  //     return res.status(400).json({
  //       ok: false,
  //       error: {
  //         message: 'El usuario que intenta eliminar no existe en la BD'
  //       }
  //     });
  //   }

  //   res.json({
  //     ok: true,
  //     usuario_eliminado: userDeleted
  //   });

  // });

});

module.exports = app;