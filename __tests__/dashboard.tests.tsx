import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Dashboard from '@/app/dashboard/page'
import 'whatwg-fetch';
import { mockFetch } from './mock-fetch'

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

describe('Dashboard', () => {
    const mockFetchResponse = [{}];
    window.fetch = mockFetch(mockFetchResponse);
    it('renders without crashing', () => {
        render(<Dashboard />)

        const elem = screen.getByText('Last Month Income')

        expect(elem).toBeInTheDocument()
    })

})