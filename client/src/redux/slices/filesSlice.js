import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getFilesData } from '../../services/fileService'
import { showNotification } from './notificationsSlice'

// Async thunk para manejar asincronismo en reducer
export const fetchFilesData = createAsyncThunk(
  'files/fetchFilesData',
  async (fileName, { rejectWithValue, dispatch }) => {
    try {
      const data = await getFilesData(fileName)
      return data
    } catch (error) {
      const errorMessage = error.message || 'Error loading files data'
      dispatch(showNotification({
        type: 'danger',
        message: errorMessage
      }))
      return rejectWithValue(errorMessage)
    }
  }
)

const initialState = {
  items: [],
  isLoading: false,
  hasError: false,
  filterName: ''
}

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setFilterName: (state, action) => {
      state.filterName = action.payload
    },
    clearFilesData: (state) => {
      state.items = []
      state.hasError = false
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilesData.pending, (state) => {
        state.isLoading = true
        state.hasError = false
      })
      .addCase(fetchFilesData.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
        state.hasError = false
      })
      .addCase(fetchFilesData.rejected, (state) => {
        state.isLoading = false
        state.hasError = true
        state.items = []
      })
  }
})

export const { setFilterName, clearFilesData } = filesSlice.actions

// Selectores
export const selectFilesData = (state) => state.files.items
export const selectIsLoadingFiles = (state) => state.files.isLoading
export const selectHasFilesError = (state) => state.files.hasError
export const selectFilterName = (state) => state.files.filterName

export default filesSlice.reducer
