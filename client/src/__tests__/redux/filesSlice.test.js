import { configureStore } from '@reduxjs/toolkit'
import filesReducer, {
  fetchFilesData,
  setFilterName,
  selectFilesData,
  selectIsLoadingFiles,
  selectFilterName
} from '../../redux/slices/filesSlice'
import * as fileService from '../../services/fileService'

jest.mock('../../services/fileService')
jest.mock('../../redux/slices/notificationsSlice', () => ({
  showNotification: jest.fn((payload) => ({ type: 'notifications/showNotification', payload }))
}))

describe('filesSlice', () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: {
        files: filesReducer
      }
    })
    jest.clearAllMocks()
  })

  it('should have correct initial state', () => {
    const state = store.getState().files
    expect(state.items).toEqual([])
    expect(state.isLoading).toBe(false)
    expect(state.hasError).toBe(false)
    expect(state.filterName).toBe('')
  })

  it('should set filter name', () => {
    store.dispatch(setFilterName('test'))
    const state = store.getState().files
    expect(state.filterName).toBe('test')
  })

  it('should fetch files data successfully', async () => {
    const mockData = [
      {
        file: 'test1.csv',
        lines: [{ text: 'sample', number: 123, hex: '12345678901234567890123456789012' }]
      }
    ]

    fileService.getFilesData.mockResolvedValueOnce(mockData)

    await store.dispatch(fetchFilesData())

    const state = store.getState().files
    expect(state.isLoading).toBe(false)
    expect(state.hasError).toBe(false)
    expect(state.items).toEqual(mockData)
  })

  it('should handle fetch error', async () => {
    fileService.getFilesData.mockRejectedValueOnce(new Error('Network error'))

    await store.dispatch(fetchFilesData())

    const state = store.getState().files
    expect(state.isLoading).toBe(false)
    expect(state.hasError).toBe(true)
    expect(state.items).toEqual([])
  })

  it('should select files data', () => {
    const mockData = [{ file: 'test.csv', lines: [] }]
    store.dispatch(fetchFilesData.fulfilled(mockData, '', undefined))

    const state = store.getState()
    expect(selectFilesData(state)).toEqual(mockData)
  })
})
