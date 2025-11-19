const axios = require('axios')
const parseCSV = require('../utils/csvParser')
const cache = require('../utils/cache')
const config = require('../../config/config')

// configuracion basica de instancia de axios (pro - DRY)
const axiosInstance = axios.create({
  baseURL: config.externalApi.baseURL,
  timeout: config.externalApi.timeout,
  headers: {
    Accept: 'application/json',
    Authorization: config.externalApi.auth
  }
})

const getFilenames = async () => {
  const cacheKey = 'fileNames'
  const cached = cache.get(cacheKey)

  // si encuentra la lista de nombres cacheada, no completa la request y devuelve el cache
  if (cached) {
    return cached
  }

  // setea el cache y devuelve la lista de la api externa
  try {
    const resp = await axiosInstance.get('/files')
    const fileNames = resp.data.files || []
    cache.set(cacheKey, fileNames, config.cache.ttl)
    return fileNames
  } catch (err) {
    console.error('Error fetching file:', err.message)
    throw err
  }
}

const getFileContent = async (filename) => {
  const cacheKey = `file:${filename}`
  const cached = cache.get(cacheKey)

  // si encuentra el contenido del archivo cacheado, no completa la request y devuelve el cache
  if (cached) {
    return cached
  }

  // setea el cache y devuelve el contenido del archivo de la api externa
  try {
    const resp = await axiosInstance.get(`/file/${filename}`)
    const parsed = parseCSV(resp.data, filename)
    cache.set(cacheKey, parsed, config.cache.ttl)
    return parsed
  } catch (err) {
    console.error(`Error fetching ${filename}:`, err.message)
    // Se setea el archivo con errores con cache difencial (explicado en config.js)
    const errorResponse = { file: filename, error: err.message, lines: [] }
    cache.set(cacheKey, errorResponse, config.cache.errorTtl)
    return errorResponse
  }
}

module.exports = { getFilenames, getFileContent }
