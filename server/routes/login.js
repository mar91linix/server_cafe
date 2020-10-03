const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const User = require('../models/user');

const app = express();


app.post('/login', (req, res) => {

    let body = req.body;

    if (!body.email) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'El email es obligatorio'
            }
        });
    }

    if (!body.password) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'El password es obligatorio'
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
            return res.status(400).json({
                ok: false,
                errorUserDB: {
                    message: '(Usuario) o contraseña incorrectos!'
                }
            });
        }

        if ( !bcrypt.compareSync( body.password, userDB.password ) ) {
            return res.status(400).json({
                ok: false,
                errorUserDB: {
                    message: 'Usuario o (contraseña) incorrectos!'
                }
            });
        }

        let token = jwt.sign({
            usuario: userDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN } );

        res.json({
            ok: true,
            user: userDB,
            token
        });

    });


});

// Configuración del Google Sign-In
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
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
    let token = req.body.idtoken;

    let googleUser = await verify( token )
                           .catch(e => {
                               return res.status(403).json({
                                   ok: false,
                                   error: e
                               });
                           });

    User.findOne( { email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: err
            });
        }

        if ( usuarioDB ) {

            if ( usuarioDB.google === false ) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Debe de iniciar sesión por el método tradicional'
                    }
                });
            } else {

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN } );

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            }
        } else {
            // Si el usuario no existe, lo creamos

            let usuario = new User();

            usuario.name = googleUser.name;
            usuario.email = googleUser.email;
            usuario.password = ':)';
            usuario.img = googleUser.img;
            usuario.google = googleUser.google;

            usuario.save( (err, userSaved) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: err
                    });
                }

                let token = jwt.sign({
                    usuario: userSaved
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN } );

                return res.json({
                    ok: true,
                    usuario: userSaved,
                    token
                });
            });
        }

    } )

});


module.exports = app;