describe('login', () => {
  before(() => {
    // ensure clean test slate for these tests
    cy.then(Cypress.session.clearCurrentSessionData)

    // intercept /Banking/screenservices/Banking/Common/Login/DataActionGetSampleUser and serve from fixtures
    cy.intercept('/Banking/screenservices/Banking/Common/Login/DataActionGetSampleUser', { fixture: 'DataActionGetSampleUser.json' }).as('DataActionGetSampleUser')

    cy.intercept('/Banking/moduleservices/moduleversioninfo?*', (req) => {
      req.continue();
    }).as('moduleversioninfo')

    cy.intercept('/Banking/moduleservices/moduleinfo?*', (req) => {
      req.continue();
    }).as('moduleinfo')
  })

  // able to click on #ContinueWithSampleUser_Button to login
  it('clicks on #ContinueWithSampleUser_Button to login', () => {
    cy.visit('/Banking/Login')

    // await moduleversioninfo and moduleinfo
    cy.wait(['@moduleversioninfo', '@moduleinfo'], { timeout: 30000 })

    cy.get('.application-name .heading6', { timeout: 15000 }).each(($el) => {
      // assert if text contain mybank
      expect($el.text()).to.contain('MyBank')
    })

    cy.get('#ContinueWithSampleUser_Button', { timeout: 15000 }).click()

    // see the word Hello, Andrea McKenzie
    cy.get('.heading1', { timeout: 15000 }).should('contain', 'Hello, Andrea McKenzie')
  })
})