import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import FilesTable from '../../components/Table'
import filesReducer from '../../redux/slices/filesSlice'
import notificationsReducer from '../../redux/slices/notificationsSlice'

const createMockStore = (filesState = {}) => {
  return configureStore({
    reducer: {
      files: filesReducer,
      notifications: notificationsReducer
    },
    preloadedState: {
      files: {
        items: [],
        isLoading: false,
        hasError: false,
        filterName: '',
        ...filesState
      },
      notifications: {
        items: []
      }
    }
  })
}

describe('FilesTable (Table) component', () => {
  it('should show loading spinner when isLoading is true', () => {
    const store = createMockStore({ isLoading: true })
    render(
      <Provider store={store}>
        <FilesTable />
      </Provider>
    )

    const spinner = screen.getByRole('status')
    expect(spinner).toBeInTheDocument()
  })

  it('should render table with data', () => {
    const mockData = [
      {
        file: 'test1.csv',
        lines: [
          {
            text: 'Sample text',
            number: 12345,
            hex: '1a2b3c4d5e6f7890abcdef1234567890'
          }
        ]
      }
    ]

    const store = createMockStore({ items: mockData })
    render(
      <Provider store={store}>
        <FilesTable />
      </Provider>
    )

    expect(screen.getByText('test1.csv')).toBeInTheDocument()
    expect(screen.getByText('Sample text')).toBeInTheDocument()
  })

  it('should render empty table when no data', () => {
    const store = createMockStore({ items: [] })
    render(
      <Provider store={store}>
        <FilesTable />
      </Provider>
    )

    const table = screen.getByRole('table')
    expect(table).toBeInTheDocument()
    expect(screen.getByText('0 filas')).toBeInTheDocument()
  })
})
