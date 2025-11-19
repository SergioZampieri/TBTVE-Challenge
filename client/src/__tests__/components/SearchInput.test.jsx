import { render, screen, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import FileFilter from '../../components/SearchInput'
import filesReducer from '../../redux/slices/filesSlice'

const createMockStore = () => {
  return configureStore({
    reducer: {
      files: filesReducer
    }
  })
}

describe('FileFilter (SearchInput) component', () => {
  it('should render search input field', () => {
    const store = createMockStore()
    render(
      <Provider store={store}>
        <FileFilter />
      </Provider>
    )

    const input = screen.getByRole('textbox', { name: /Filtrar por nombre de archivo/i })
    expect(input).toBeInTheDocument()
  })

  it('should update input value when typing', () => {
    const store = createMockStore()
    render(
      <Provider store={store}>
        <FileFilter />
      </Provider>
    )

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test' } })

    expect(input).toHaveValue('test')
  })
})
