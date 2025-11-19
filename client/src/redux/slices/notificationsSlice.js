import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: []
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    showNotification: (state, action) => {
      state.items.push({
        id: Date.now(),
        type: 'info',
        delay: 5000,
        ...action.payload
      })
    },
    dismissNotification: (state, action) => {
      state.items = state.items.filter(({ id }) => id !== action.payload)
    },
    clearAllNotifications: (state) => {
      state.items = []
    }
  }
})

export const { showNotification, dismissNotification, clearAllNotifications } = notificationsSlice.actions

// Selector
export const selectAllNotifications = (state) => state.notifications.items

export default notificationsSlice.reducer
