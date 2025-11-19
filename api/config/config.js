// queda pendiente implementar dot-env u otra libreria para usar un .env y no dejar expuesta la autorizacion. Solo por el pedido explicito de la consigna no se uso un archivo con variables de entorno.
module.exports = {
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost'
  },
  externalApi: {
    baseURL: process.env.EXT_API || 'https://echo-serv.tbxnet.com/v1/secret',
    timeout: 4000, // 4 segs para preveer que la consulta se cuelgue.
    auth: process.env.EXT_API_KEY || 'Bearer aSuperSecretKey'
  },
  cache: {
    ttl: 60000, // 1 min de lifespan para reservar la data sin errores
    errorTtl: 30000 // 30 segs de lifespan para los errores, asi se permiten retries mas rapido
  }
}
