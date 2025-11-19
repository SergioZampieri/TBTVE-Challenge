import { useEffect, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchFilesData, selectFilterName } from './redux/slices/filesSlice'
import { debounce } from './utils/debounce'
import Header from './components/Header'
import FileFilter from './components/SearchInput'
import FilesTable from './components/Table'
import ToastNotification from './components/ToastNotification'
import { Container } from 'react-bootstrap'

export default function App() {
  const dispatch = useDispatch()
  const filterName = useSelector(selectFilterName)
  const isFirstRender = useRef(true)

  // se usa el hook useMemo para preservar la instancia de la funcion "debounceada" entre los re-renderizados
  const debouncedFetch = useMemo(
    () => debounce((filter) => {
      dispatch(fetchFilesData(filter))
    }, 500),
    [dispatch]
  )

  // refresh de data cuando se carga el componente
  useEffect(() => {
    dispatch(fetchFilesData())
  }, [dispatch])

  // skipeando la primera vez que se monta el componente, se vuelve a fetchear cuando el input de busqueda es modificado por el usuario
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    debouncedFetch(filterName || '')
  }, [filterName, debouncedFetch])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <ToastNotification />
      <Header />
      <Container fluid="xl" className="px-3 px-md-4 pb-5">
        <FileFilter />
        <FilesTable />
      </Container>
    </div>
  )
}
