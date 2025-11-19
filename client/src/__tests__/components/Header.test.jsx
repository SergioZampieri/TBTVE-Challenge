import { render, screen } from '@testing-library/react'
import Header from '../../components/Header'

describe('Header component', () => {
  it('should render the header with title', () => {
    render(<Header />)

    const title = screen.getByRole('heading', { name: /Toolbox - Tabla de archivos/i })
    expect(title).toBeInTheDocument()
  })
})
