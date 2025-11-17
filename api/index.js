const http = require("http")
const app = require("./src/app")

const port = process.env.PORT || 3000
const hostname = process.env.HOSTNAME || "localhost"

const server = http.createServer(app)

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})
