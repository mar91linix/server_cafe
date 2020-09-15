/**
 * El puerto global
 */

process.env.MONGODB_5000


/**************
 * Duracion del token
 ********************/
//60 segundos
// 60 minutos
//24 horas
// 30 dias
process.env.CAUDOCIDAD_TOKEN =  60 * 60 * 24 * 30;



 
/**************
 * Duracion del token
 ********************/
process.env.SEED =  process.env.SEED || 'september-charli@-12345';