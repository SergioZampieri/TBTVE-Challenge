import { render, screen } from '@testing-library/react'
import App from '../App.jsx'

describe('App tests', () => {
  it('should contains the heading 1', () => {
    render(<App />)

    const heading = screen.getByText(/Hello Toolbox!/i)
    expect(heading).toBeDefined()
  })
})
