import apiClient from './api'

export const getFilesList = async () => {
  try {
    const response = await apiClient.get('/files/list')
    return response.files || []
  } catch (error) {
    console.error('Failed to fetch files name list:', error)
    throw error
  }
}

export const getFilesData = async fileName => {
  try {
    const params = fileName ? { fileName } : {}
    const response = await apiClient.get('/files/data', { params })
    return response
  } catch (error) {
    console.error('Failed to fetch files data:', error)
    throw error
  }
}
