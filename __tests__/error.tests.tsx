import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Error from '@/app/error/page'

jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(() => ({
        auth: {
            user: jest.fn(),
            onAuthStateChange: jest.fn(),
        },
    })),
}));

jest.mock('next/navigation', () => ({
    useRouter(){
        return {
            prefetch: () => null
        };
    }
}));

describe('Error page', () => {
    it('renders without crashing', () => {
        render(<Error />)

        const elem = screen.getByText('Error Page')

        expect(elem).toBeInTheDocument()
    })

})