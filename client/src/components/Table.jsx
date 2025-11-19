import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Table, Spinner, Card, Badge } from 'react-bootstrap'
import { selectFilesData, selectIsLoadingFiles } from '../redux/slices/filesSlice'
import { showNotification } from '../redux/slices/notificationsSlice'

export default function FilesTable() {
  const filesData = useSelector(selectFilesData)
  const isLoading = useSelector(selectIsLoadingFiles)
  const dispatch = useDispatch()
  const hasShownEmptyNotification = useRef(false)

  // transforma los datos de la respuesta para poder mostrarlos en la tabla
  const flattenedData = filesData?.flatMap(({ file, lines = [] }) =>
    lines.map((line) => ({ file, ...line }))
  ) ?? []

  // despacha la notificacion cuando no hay promesas en pending, no hay datos a mostrar y la notificacion todavia no fue mostrada
  useEffect(() => {
    if (!isLoading && flattenedData.length === 0 && !hasShownEmptyNotification.current) {
      dispatch(showNotification({
        type: 'info',
        message: 'No hay archivos disponibles, prueba usando otros parametros de busqueda. Si el problema persiste, notifica al administrador del sitio'
      }))
      hasShownEmptyNotification.current = true
    }

    if (flattenedData.length > 0) {
      hasShownEmptyNotification.current = false
    }
  }, [isLoading, flattenedData.length, dispatch])

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <Card.Body className="text-center p-5">
          <Spinner animation="border" role="status" variant="danger">
            <span className="visually-hidden">Cargando</span>
          </Spinner>
          <p className="mt-3 text-muted mb-0">Cargando datos</p>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center py-3">
        <h5 className="mb-0 fw-semibold">
          <i className="bi bi-table me-2 text-danger"></i>
          Resultados
        </h5>
        <Badge bg="secondary" className="px-3 py-2 ">
          {flattenedData.length} {flattenedData.length === 1 ? 'filas' : 'filas'}
        </Badge>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th className="fw-semibold" style={{ position: 'sticky', left: 0, backgroundColor: '#f8f9fa', zIndex: 10, boxShadow: '2px 0 4px rgba(0,0,0,0.05)' }}>
                  <i className="bi bi-file-earmark me-1"></i>
                  Archivo
                </th>
                <th className="fw-semibold">
                  <i className="bi bi-chat-left-text me-1"></i>
                  Texto
                </th>
                <th className="fw-semibold text-end">
                  <i className="bi bi-hash me-1"></i>
                  Número
                </th>
                <th className="fw-semibold" style={{ minWidth: '280px' }}>
                  <i className="bi bi-code-square me-1"></i>
                  Hex
                </th>
              </tr>
            </thead>
            <tbody>
              {flattenedData.map((item, index) => (
                <tr key={`${item.file}-${item.hex}-${index}`}>
                  <td className="fw-medium" style={{ position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 9, boxShadow: '2px 0 4px rgba(0,0,0,0.05)' }}>{item.file}</td>
                  <td>{item.text}</td>
                  <td className="text-end font-monospace">{item.number.toLocaleString()}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <code className="bg-light px-2 py-1 rounded small">{item.hex}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  )
}
