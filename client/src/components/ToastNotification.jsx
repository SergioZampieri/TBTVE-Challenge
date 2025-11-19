import { Toast, ToastContainer } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { selectAllNotifications, dismissNotification } from '../redux/slices/notificationsSlice'

const TOAST_CONFIG = {
  danger: { icon: 'bi-exclamation-triangle-fill', title: 'Error' },
  info: { icon: 'bi-info-circle-fill', title: 'Información' },
  warning: { icon: 'bi-exclamation-circle-fill', title: 'Advertencia' },
  success: { icon: 'bi-check-circle-fill', title: 'Éxito' }
}

export default function ToastNotification() {
  const notifications = useSelector(selectAllNotifications)
  const dispatch = useDispatch()

  return (
    <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999 }}>
      {notifications.map(({ id, type = 'info', message, delay }) => {
        const { icon, title } = TOAST_CONFIG[type] || TOAST_CONFIG.info

        return (
          <Toast
            key={id}
            onClose={() => dispatch(dismissNotification(id))}
            delay={delay}
            autohide
            bg="secondary"
          >
            <Toast.Header>
              <i className={`${icon} me-2`}></i>
              <strong className="me-auto">{title}</strong>
            </Toast.Header>
            <Toast.Body className="text-white">{message}</Toast.Body>
          </Toast>
        )
      })}
    </ToastContainer>
  )
}
