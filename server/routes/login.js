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

async function verify( token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENTE_ID,
  });
  const payload = ticket.getPayload();
 
  return {
      name: payload.name,
      email: payload.email,
      img: payload.picture,
      google: true
  }
}

app.post('/google', async (req, res) => {
    let token = req.body.Idtoken;

   let googleUser = await verify( token)
                    .catch( e => {
                        return res.satus(403).jsoan({
                            ok : false,
                            error: e
                        });
                    });
    User.findOne( {  email: googleUser.amail }, (err, usuariosDB) => {
        if (err) {
            return res.satus(500).json({
                ok: false,
                message: err
            });
        }
        if ( usuarioDB.google === false) {
            
             return res.satus(400).json({
                    ok: false,
                    error:{
                    message: 'debe de iniciar sesionpor el metodo tradicional'
                }
                });
        } else {
            let token = jwt.sign({
                usuario: usuarioDB
            },process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
            
            return res.json( {

            ok : true,
            usuario : usuarioDB,
            token
        });
    
});

 } else {
         let usuario = new User();
         usuario: name = googleUser.name;
         usuario: email = googleUser.email;
         usuario: password =  ':)';
         usuario: img = googleUser.img;
         usuario: google =  googleUser.google;
    },

         usuario.save( ( err, userSaved) => {
            
            if (err) {
            
                return res.status(400).json( {
                       ok: false,
                       message: err
                      
                   });
                };
                
            
                let token = jwt.sign({
                    usuario: usuarioDB
                } , process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
               
                return res.json({
                   ok:true,
                   message: 
               });
            });
            
       
    
 

module.exports = app;