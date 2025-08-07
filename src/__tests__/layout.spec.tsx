import { render, screen, fireEvent } from '@testing-library/react'
import Layout from '../components/Layout'
import { BrowserRouter } from 'react-router-dom'

describe('Layout component', () => {
  it('renders IntelliSheet text', () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    )

    expect(screen.getByText(/IntelliSheet/i)).toBeInTheDocument()
  })

  it('toggles sidebar visibility', () => {
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    )

    const toggleButton = screen.getByRole('button')
    fireEvent.click(toggleButton)

    expect(screen.queryByText(/IntelliSheet/i)).not.toBeInTheDocument()
  })
})