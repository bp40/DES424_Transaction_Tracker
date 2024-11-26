describe('loads ok', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')
    cy.contains('Welcome to Transaction Tracker')

  })
})

describe('can go to login', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')
    cy.contains('Welcome to Transaction Tracker')
    cy.get('[href="/auth/login"]').click()
    cy.url({timeout: 10000}).should('include', 'login')
  })
})

describe('can go to signup', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')
    cy.contains('Welcome to Transaction Tracker')
    cy.get('[href="/auth/signup"]').click()
    cy.url({timeout: 10000}).should('include', 'signup')
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