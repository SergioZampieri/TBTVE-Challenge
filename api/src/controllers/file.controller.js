const { getFileNames, getFileContent } = require("../services/file.service")
const partialMatch = require("../utils/stringPartialMatcher")

async function getFileNamesHelper() {
  const filenames = await getFileNames()

  if (!filenames || filenames.length === 0) {
    const err = new Error("Error: Files are not available")
    err.status = 404
    throw err
  }
  return filenames
}

async function getList(res, next) {
  try {
    const filenames = await getFileNamesHelper()
    return res.status(200).json(filenames)
  } catch (err) {
    next(err)
  }
}

async function getFormattedData(req, res, next) {
  //const fileToSearch = req.query.fileName || null
  const fileToSearch = "2.csv"
  try {
    const filenames = await getFileNamesHelper()
    const matchedFiles = fileToSearch ? partialMatch(filenames, fileToSearch) : filenames

    const formattedData = []

    for (const filename of matchedFiles) {
      const content = await getFileContent(filename)
      if (content?.lines?.length) formattedData.push(content)
    }

    return res.status(200).json(formattedData)
  } catch (err) {
    next(err)
  }
}

module.exports = { getFormattedData, getList }
