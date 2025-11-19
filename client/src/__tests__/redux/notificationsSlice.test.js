import { configureStore } from '@reduxjs/toolkit'
import notificationsReducer, {
  showNotification,
  dismissNotification,
  selectAllNotifications
} from '../../redux/slices/notificationsSlice'

describe('notificationsSlice', () => {
  let store

  beforeEach(() => {
    store = configureStore({
      reducer: {
        notifications: notificationsReducer
      }
    })
  })

  it('should have empty items array initially', () => {
    const state = store.getState().notifications
    expect(state.items).toEqual([])
  })

  it('should add notification with default values', () => {
    store.dispatch(showNotification({ message: 'Test notification' }))

    const state = store.getState().notifications
    expect(state.items).toHaveLength(1)
    expect(state.items[0].message).toBe('Test notification')
    expect(state.items[0].type).toBe('info')
    expect(state.items[0].delay).toBe(5000)
  })

  it('should dismiss notification by id', () => {
    store.dispatch(showNotification({ message: 'First' }))
    store.dispatch(showNotification({ message: 'Second' }))

    const state = store.getState().notifications
    const firstId = state.items[0].id

    store.dispatch(dismissNotification(firstId))

    const newState = store.getState().notifications
    expect(newState.items).toHaveLength(1)
    expect(newState.items[0].message).toBe('Second')
  })

  it('should select all notifications', () => {
    store.dispatch(showNotification({ message: 'First' }))
    store.dispatch(showNotification({ message: 'Second' }))

    const state = store.getState()
    const notifications = selectAllNotifications(state)

    expect(notifications).toHaveLength(2)
  })
})
