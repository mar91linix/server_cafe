const jwt = require('jsonwebtoken');

/**
 * Verifacion toke
 */

let verificaToken = (( req, res, next) => {
     
     let _token = req.get ('token');
 
    jwt.verify (_token, process.env.SEED,  (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

         req.usuario = decoded.usuario;
          next();
    });
    
});

let verificaAdminRole = ( ( req, res, next ) => {
     let usuario = req.usuario;

     if ( usuario.role === ADMIN_ROLE){
         next();
     }else{
         return res.json({
             ok: false,
             error:{
                 message: 'Prohibido..usted no es un usuario Adminstardor'
             }
         });

     }
   
 });
 module.exports = {
     verificaToken,
     verificaAdminRole
 }