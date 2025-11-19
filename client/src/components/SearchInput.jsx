import { useSelector, useDispatch } from 'react-redux'
import { Form, InputGroup } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import { setFilterName, selectFilterName } from '../redux/slices/filesSlice'

export default function FileFilter() {
  const dispatch = useDispatch()
  const value = useSelector(selectFilterName)

  const handleChange = (e) => {
    dispatch(setFilterName(e.target.value))
  }

  return (
    <div className="mb-4">
      <InputGroup size="lg">
        <FloatingLabel controlId="searchInput" label="Buscar archivo">
          <Form.Control
            type="text"
            placeholder="Buscar archivo"
            value={value}
            onChange={handleChange}
            aria-label="Filtrar por nombre de archivo"
          />
        </FloatingLabel>
      </InputGroup>
    </div>
  )
}
