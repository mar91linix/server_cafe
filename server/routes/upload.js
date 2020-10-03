const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const fs = require('fs');
const path = require('path');

const User = require('../models/user');
const Product = require('../models/product');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    // Validamos que al menos llegue un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
                  .json({
                      ok: false,
                      error: {
                          message: 'No se ha seleccionado ningún archivo para adjuntar'
                      }
                  });
    }

    // Validar tipo de subida
    let tiposValidos = ['products', 'users'];

    if ( tiposValidos.indexOf( tipo ) < 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                tipo_enviado: tipo,
                message: 'El tipo de subida que está intentando hacer no es válida!. Los tipos válidos son: ' + tiposValidos.join(', ')
            }
        });
    }

    // En caso de recibir un archivo, lo procesamos
    let miArchivo = req.files.archivo;

    let nombreCortado = miArchivo.name.split('.');

    let extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Extensiones válidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if ( extensionesValidas.indexOf( extensionArchivo ) < 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                extension_archivo: extensionArchivo,
                message: 'La extensión del archivo que está intentando subir no es válida!. Las extensiones válidas son: ' + extensionesValidas.join(', ')
            }
        });
    }

    // Personalizar el nombre del archivo
    let nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extensionArchivo}`; // asdf090asfi09asf0-445664545644554.jpg

    miArchivo.mv(`uploads/${ tipo }/${ nombreArchivo } `, (err) => {
        if (err)
          return res.status(500).json({
              ok: false,
              err
          });
    
        // Aqui function de actualizar img
        if ( tipo === 'users') {
            cargarImgUser(id, res, nombreArchivo);
        } else {
            cargarImgProducts(id, res, nombreArchivo);
        }
        
      });

});


// Función para cargar la img del usuario
function cargarImgUser(id, res, fileName) {

    User.findById( id, (err, userDB) => {

        if (err) {
            eliminarArchivo(fileName, 'users' );
            return res.status(400).json({
              ok: false,
              message: err
            });
        }

        if (!userDB) {
            eliminarArchivo(fileName, 'users' );
            return res.status(400).json({
              ok: false,
              error: {
                message: 'El usuario que intenta actualizar no existe en la BD'
              }
            });
        }

        // Validar si la img del usuario ya existe
        eliminarArchivo(userDB.img, 'users' );

        userDB.img = fileName;

        userDB.save( (err, userSaved) => {

            if (err) {
                return res.status(400).json({
                  ok: false,
                  message: err
                });
            }

            res.json({
                ok: true,
                message: 'Imágen subida correctamente!',
                usuario_actualizado: userSaved,
                img: fileName
            });

        });

    });

}

// Función para cargar la img del producto
function cargarImgProducts(id, res, fileName) {

    Product.findById( id, (err, productDB) => {

        if (err) {
            eliminarArchivo(fileName, 'products' );
            return res.status(400).json({
              ok: false,
              message: err
            });
        }

        if (!productDB) {
            eliminarArchivo(fileName, 'products' );
            return res.status(400).json({
              ok: false,
              error: {
                message: 'El producto que intenta actualizar no existe en la BD'
              }
            });
        }

        // Validar si la img del producto ya existe
        eliminarArchivo(productDB.img, 'products' );

        productDB.img = fileName;

        productDB.save( (err, productSaved) => {

            if (err) {
                return res.status(400).json({
                  ok: false,
                  message: err
                });
            }

            res.json({
                ok: true,
                message: 'Imágen subida correctamente!',
                producto_actualizado: productSaved,
                img: fileName
            });

        });

    });

}


function eliminarArchivo(nombreImg, tipo) {
    let pathImagen = path.resolve( __dirname, `../../uploads/${tipo}/${ nombreImg }`);

    if ( fs.existsSync(pathImagen) ) {
        fs.unlinkSync(pathImagen);
    }
}


module.exports = app;