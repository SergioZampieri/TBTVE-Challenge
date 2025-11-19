import { configureStore } from '@reduxjs/toolkit'
import filesReducer from './slices/filesSlice'
import notificationsReducer from './slices/notificationsSlice'

export const store = configureStore({
  reducer: {
    files: filesReducer,
    notifications: notificationsReducer
  }
})