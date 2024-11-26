describe('dashboard with login', () => {
    it('passes', () => {
        cy.visit('http://localhost:3000/dashboard')
        cy.url().should('include', 'login')
        cy.get('#email').type('test@mail.com')
        cy.get('#password').type('123456')
        cy.get('button').contains('Login').click()
        cy.url({timeout: 10000}).should('include', 'dashboard')
    })
})