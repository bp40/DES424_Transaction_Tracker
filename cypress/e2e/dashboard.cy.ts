describe('dashboard without login', () => {
    it('passes', () => {
        cy.visit('http://localhost:3000/dashboard')
        cy.url().should('include', 'login')
    })
})

describe('can go to signup', () => {
    it('passes', () => {
        cy.visit('http://localhost:3000/dashboard')
        cy.get('.font-bold').click()
        cy.url().should('include', 'signup')
    })
})

describe('navbar loads correctly', () => {
    it('passes', () => {
        cy.visit('http://localhost:3000')
        cy.get('[href="/"]').should('be.visible')
        cy.get('[href="/dashboard"]').should('be.visible')
        cy.get('[href="/transactions"]').should('be.visible')
        cy.get('[href="/auth/login"]').should('be.visible')
        cy.get('[href="/auth/signup"]').should('be.visible')
    })
})