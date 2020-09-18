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
process.env.CADUCIDAD_TOKEN =  60 * 60 * 24 * 30;



 
/**************
 * Duracion del token
 ********************/
process.env.SEED =  process.env.SEED || 'september-charli@-12345';


/******
 * envariomer
 */

 process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


 
/******
 *DB url
 */
let urlDB;

if (process.env.NODE_ENV === 'dev ') {
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB =  process.env.MONGO_URL;
}
process.env.URLDB = urlDB;