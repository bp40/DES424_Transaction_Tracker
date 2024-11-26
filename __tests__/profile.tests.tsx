import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Profile from '@/app/profile/page'

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

describe('Profile page', () => {
    it('renders without crashing', () => {
        render(<Profile />)

        const elem = screen.getByText('Hello, this is the Profile page')

        expect(elem).toBeInTheDocument()
    })

})