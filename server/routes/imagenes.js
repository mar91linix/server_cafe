const express = require('express');
const fs = require('fs');
const path = require('path');

const { verificaToken } = require('../milddlewares/autenticacion');
 
const app = express();

app.get('/images/:tipo/:img', verificaToken, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImagen = path.resolve( __dirname, `../../uploads/${tipo}/${ img }`);
    let noImg = path.resolve( __dirname, '../assets/no-image.png' );

    if ( fs.existsSync(pathImagen) ) {
        res.sendFile(pathImagen);
    } else {
        res.sendFile(noImg);
    }
    

});


module.exports = app;