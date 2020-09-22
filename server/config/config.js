/**
 * El puerto global
 */

process.env.PORT = process.env.PORT || 5000;



/**************
 * Duracion del token
 ********************/
//60 segundos
// 60 minutos
//24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = '12h';




/**************
 *SEDD
 ********************/
process.env.SEED = process.env.SEED || 'september-charglie@-12345';


/******
 *Environment
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'



/******
 *DB URI
 */
let urlDB;

if (process.env.NODE_ENV === 'dev ') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

/**
 * google cleiente iD
 *
 */
process.env.CLIENT_ID = process.env.CLIENT_ID ||' 105669234204-tgarcj56vu415528haccls0n9rctg9gn.apps.googleusercontent.com';