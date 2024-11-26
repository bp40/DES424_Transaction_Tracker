import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Transactions from '@/app/transactions/page'

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

describe('Transactions page', () => {
    it('renders without crashing', () => {
        render(<Transactions />)

        const elem = screen.getByText('All transactions')

        expect(elem).toBeInTheDocument()
    })

})