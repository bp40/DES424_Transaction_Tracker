import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Login from '@/app/auth/login/page'

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

describe('Login page', () => {
    it('renders without crashing', () => {
        render(<Login />)

        const elem = screen.getByText('Login with your Email')

        expect(elem).toBeInTheDocument()
    })

})