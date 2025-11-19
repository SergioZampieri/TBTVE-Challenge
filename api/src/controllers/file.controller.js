const { getFilenames, getFileContent } = require('../services/file.service')
const partialMatch = require('../utils/stringPartialMatcher')

// helper para modularizar mejor el codigo
async function getValidFilenames () {
  const filenames = await getFilenames()

  if (!filenames || filenames.length === 0) {
    return []
  }
  return filenames
}

async function getList (req, res, next) {
  try {
    const filenames = await getValidFilenames()
    return res.status(200).json(filenames)
  } catch (err) {
    next(err)
  }
}

async function getFormattedData (req, res, next) {
  const fileToSearch = req.query.fileName || null

  try {
    // consulta los nombres de los archivos y aplica los filtros si hubo queryparams desde el frontend
    const filenames = await getValidFilenames()
    const matchedFiles = fileToSearch ? partialMatch(filenames, fileToSearch) : filenames

    // paraleliza las consultas de contenido y evita secuencializad
    const contentPromises = matchedFiles.map(filename => getFileContent(filename))
    const contents = await Promise.all(contentPromises)

    // separa los archivos con errores y los que van a ser enviados al frontend
    const successfulFiles = []
    const failedFiles = []

    contents.forEach(content => {
      if (content?.error) {
        failedFiles.push({ file: content.file, error: content.error })
      } else if (content?.lines?.length) {
        successfulFiles.push(content)
      }
    })

    // se visibilizan los archivos con errores
    if (failedFiles.length > 0) {
      console.warn(`Failed to fetch ${failedFiles.length} file(s):`, failedFiles)
    }

    return res.status(200).json(successfulFiles)
  } catch (err) {
    next(err)
  }
}

module.exports = { getFormattedData, getList }
