import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'
import Nav from '@/app/layout'

jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(() => ({
        auth: {
            user: jest.fn(),
            onAuthStateChange: jest.fn(),
        },
    })),
}));

describe('Home page', () => {
    it('renders without crashing', () => {
        render(<Home />)

        const elem = screen.getByText('Welcome to Transaction Tracker')

        expect(elem).toBeInTheDocument()
    })

})
