const express = require('express')
const { getFormattedData, getList } = require('../controllers/file.controller')

const router = express.Router()

// GET => devuelve todo el contenido de los archivos listados
router.get('/data', getFormattedData)
// GET => devuelve la lista de nombres de archivos
router.get('/list', getList)

module.exports = router
