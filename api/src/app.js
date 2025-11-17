const express = require("express")
const filesRoutes = require("./routes/file.routes")
const notFoundMiddleware = require("./middlewares/notFound")
const errorHandlerMiddleware = require("./middlewares/errorHandler")

const app = express()

app.use(express.json())

// ROUTES
app.use("/files", filesRoutes)

//error handling
app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

module.exports = app
