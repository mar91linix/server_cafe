const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENTE_ID);

const User = require('../models/user');

const app = express();

app.post('/login', (req, res) => {
     
    let body = req.body;

    if (!body.email){
        
            return res.status(400).json({
                ok: false,
                error:{
                message:  'por favor ingrese un email valido',
                err
            }
            });
        }
    
        if (!body.password){
        
            return res.status(400).json({
                ok: false,
                error:{
                message:  'el pasword es nesesario',
                err
            }
            });
        }



    User.findOne( { email: body.email }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            });
        }

        if ( !userDB ) {
            return res.status(400).json ({
                ok: false,
                errorUserDB: {
                    message: ' (Usuario) o cotraseña incorretos..'
                }
            });
            }

      if  ( !bcrypt.compareSync( body.password, userDB.password ) ) {
        return res.status(400).json ({
            ok: false,
            errorUserDB: {
                message: 'Usuario o (cotraseña) incorretos..'

            }
        });
       }

    let token = jwt.sign({
        usuario: userDB
    }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN } );

    res.json({
        ok: true,
        user: userDB,
        token
    });

    });


});

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENTE_ID,
  });
  const payload = ticket.getPayload();
  console.log(payload)

}

app.post('/google', (req, res) => {
    let token = req.body.Idtoken;

    verify(token)

    res.json({
        token: token
    });

});
module.exports = app;