const axios = require("axios")
const parseCSV = require("../utils/csvParser")

const axiosInstance = axios.create({
  baseURL: "https://echo-serv.tbxnet.com/v1/secret",
  timeout: 4000,
  headers: {
    Accept: "application/json",
    Authorization: "Bearer aSuperSecretKey"
  }
})

const getFileNames = async () => {
  try {
    const resp = await axiosInstance.get("/files")
    return resp.data.files || []
  } catch (err) {
    console.error("Error fetching file:", err.message)
    throw err
  }
}

const getFileContent = async (filename) => {
  try {
    const resp = await axiosInstance.get(`/file/${filename}`)
    const parsed = parseCSV(resp.data, filename)
    return parsed
  } catch (err) {
    console.error(`Error fetching ${filename}:`, err.message)
    return null
  }
}

module.exports = { getFileNames, getFileContent }
