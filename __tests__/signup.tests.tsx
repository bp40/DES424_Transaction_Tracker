import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Signup from '@/app/auth/signup/page'

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
        render(<Signup />)

        const elem = screen.getByText('Sign up with your Email')

        expect(elem).toBeInTheDocument()
    })

})