const http = require('http')
const app = require('./src/app')
const config = require ('./config/config')

const port = config.server.port 
const hostname = config.server.host

const server = http.createServer(app)

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
