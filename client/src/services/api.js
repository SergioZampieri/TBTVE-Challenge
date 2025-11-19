import axios from 'axios'
import config from '../../config/config'

const apiClient = axios.create({
  baseURL: config.env.apiUrl,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

// uso la instancia de axios para implementar un interceptor de respueta generalizado
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred'

    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: errorMessage
    })

    return Promise.reject(new Error(errorMessage))
  }
)

export default apiClient
