import { render, screen, fireEvent, act } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import ToastNotification from '../../components/ToastNotification'
import notificationsReducer from '../../redux/slices/notificationsSlice'

const createMockStore = (initialNotifications = []) => {
  return configureStore({
    reducer: {
      notifications: notificationsReducer
    },
    preloadedState: {
      notifications: {
        items: initialNotifications
      }
    }
  })
}

describe('ToastNotification component', () => {
  it('should render notification with message', () => {
    const store = createMockStore([
      { id: 1, type: 'info', message: 'Test notification', delay: 5000 }
    ])

    render(
      <Provider store={store}>
        <ToastNotification />
      </Provider>
    )

    expect(screen.getByText('Test notification')).toBeInTheDocument()
    expect(screen.getByText('Información')).toBeInTheDocument()
  })

  it('should render nothing when no notifications', () => {
    const store = createMockStore([])
    const { container } = render(
      <Provider store={store}>
        <ToastNotification />
      </Provider>
    )

    const toastContainer = container.querySelector('.toast-container')
    expect(toastContainer).toBeInTheDocument()
    expect(toastContainer.children.length).toBe(0)
  })
})
