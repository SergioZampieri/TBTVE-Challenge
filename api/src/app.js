const express = require('express')
const filesRoutes = require('./routes/file.routes')
const notFoundMiddleware = require('./middlewares/notFound')
const errorHandlerMiddleware = require('./middlewares/errorHandler')
const corsHeaders = require('./middlewares/corsMiddleware')

const app = express()

app.use(corsHeaders)
app.use(express.json())

// ROUTES
app.use('/files', filesRoutes)

// error handling
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

module.exports = app
