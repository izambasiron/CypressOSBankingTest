describe('dashboard is functional', { testIsolation: false }, () => {
    before(() => {
        cy.then(Cypress.session.clearCurrentSessionData)

        cy.intercept('/Banking/moduleservices/moduleversioninfo?*', (req) => {
            req.continue();
        }).as('moduleversioninfo')

        cy.intercept('/Banking/moduleservices/moduleinfo?*', (req) => {
            req.continue();
        }).as('moduleinfo')
    })

    it('visits the dashboard page', () => {
        cy.visit('/Banking/Login')

        cy.wait(['@moduleversioninfo', '@moduleinfo'], { timeout: 30000 })

        cy.get('#ContinueWithSampleUser_Button', { timeout: 30000 }).click()

        cy.get('.heading1', { timeout: 30000 }).should('contain', 'Hello, Andrea McKenzie')
    })

    // click on saving accounts updates transactions
    describe('saving accounts button', () => {
        it('updates transaction on click', () => {
            cy.intercept('POST', '/Banking/screenservices/Banking/MainFlow/Home/ScreenDataSetGetTransactionsByAccount')
              .as('ScreenDataSetGetTransactionsByAccount')

            cy.get('#AccountOverview_Wrapper [id$="AccountName"]', { timeout: 15000 }).contains('Saving').click()

            // assert that creenDataSetGetTransactionsByAccount has been called
            cy.wait(['@ScreenDataSetGetTransactionsByAccount'], { timeout: 30000 }).its('response.statusCode').should('eq', 200)
        })
    })
})
