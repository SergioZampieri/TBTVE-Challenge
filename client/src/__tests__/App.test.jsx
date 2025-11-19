import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import App from '../App'
import filesReducer from '../redux/slices/filesSlice'
import notificationsReducer from '../redux/slices/notificationsSlice'
import * as fileService from '../services/fileService'

jest.mock('../services/fileService')
jest.mock('../utils/debounce', () => ({
  debounce: (fn) => fn
}))

describe('App component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    fileService.getFilesData.mockResolvedValue([])
  })

  it('should render without crashing', async () => {
    const store = configureStore({
      reducer: {
        files: filesReducer,
        notifications: notificationsReducer
      }
    })

    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByText(/Toolbox - Tabla de archivos/i)).toBeInTheDocument()
    })
  })

  it('should fetch files data on mount', async () => {
    fileService.getFilesData.mockResolvedValue([
      {
        file: 'test.csv',
        lines: [{ text: 'data', number: 123, hex: '12345678901234567890123456789012' }]
      }
    ])

    const store = configureStore({
      reducer: {
        files: filesReducer,
        notifications: notificationsReducer
      }
    })

    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    await waitFor(() => {
      expect(fileService.getFilesData).toHaveBeenCalled()
    })
  })

  it('should display fetched data in table', async () => {
    fileService.getFilesData.mockResolvedValue([
      {
        file: 'data.csv',
        lines: [{ text: 'Sample', number: 999, hex: '12345678901234567890123456789012' }]
      }
    ])

    const store = configureStore({
      reducer: {
        files: filesReducer,
        notifications: notificationsReducer
      }
    })

    render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    await waitFor(() => {
      expect(screen.getByText('data.csv')).toBeInTheDocument()
      expect(screen.getByText('Sample')).toBeInTheDocument()
    })
  })
})
