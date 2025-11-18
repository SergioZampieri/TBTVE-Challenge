const express = require('express')
const { getFormattedData, getList } = require('../controllers/file.controller')

const router = express.Router()

router.get('/data', getFormattedData)
router.get('/list', getList)

module.exports = router
