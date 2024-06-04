// Test dashboard page
describe('dashboard', { testIsolation: false }, () => {
    before(() => {
        cy.then(Cypress.session.clearCurrentSessionData)

        cy.intercept('/Banking/moduleservices/moduleversioninfo?*', (req) => {
            req.continue();
        }).as('moduleversioninfo')

        cy.intercept('/Banking/moduleservices/moduleinfo?*', (req) => {
            req.continue();
        }).as('moduleinfo')

        cy.intercept('/Banking/screenservices/Banking/Common/Login/DataActionGetSampleUser',
            { fixture: 'DataActionGetSampleUser.json' }).as('DataActionGetSampleUser')

        cy.intercept('/Banking/screenservices/Banking/MainFlow/Home/ScreenDataSetGetAccountsByOwner',
            { fixture: 'ScreenDataSetGetAccountsByOwner.json' }).as('ScreenDataSetGetAccountsByOwner')

        cy.intercept('/Banking/screenservices/Banking/MainFlow/Home/ScreenDataSetGetTransactionsByAccount',
            { fixture: 'ScreenDataSetGetTransactionsByAccount.json' }).as('ScreenDataSetGetTransactionsByAccount')
    })

    afterEach(function () {
        if (this.currentTest.state === 'failed') {
            Cypress.runner.stop()
        }
    });

    it('visits the dashboard page', () => {
        cy.visit('/Banking/Login')

        cy.wait(['@moduleversioninfo', '@moduleinfo'], { timeout: 30000 })

        cy.get('#ContinueWithSampleUser_Button', { timeout: 30000 }).click()

        cy.get('.heading1', { timeout: 30000 }).should('contain', 'Hello, Andrea McKenzie')
    })

    describe('In the header', () => {
        it('has an application name', () => {
            cy.get('.application-name .heading6', { timeout: 15000 }).each(($el) => {
                expect($el.text()).to.contain('MyBank')
            })
        })

        it('has Home, contact and branch finder links', () => {
            cy.get('.app-menu-links a', { timeout: 15000 }).each(($el) => {
                expect($el.text()).to.match(/Home|Contact us|Branch Finder/i)
            })
        })

        it('has a user profile dropdown with options to go to Profile and logout', () => {
            cy.get('[data-block="Common.UserInfo"]', { timeout: 15000 }).click()
            cy.get('[data-block="Common.UserInfo"] .osui-submenu__items', { timeout: 15000 }).each(($el) => {
                expect($el.text()).to.match(/Profile|Log out/)
            })
        })
    })

    describe('In content-top', () => {
        it('has a heading that says Welcome, Andrea McKenzie', () => {
            cy.get('.content-top .content-top-title.heading1', { timeout: 15000 }).should('contain', 'Hello, Andrea McKenzie')
        })

        it('has a button to Send money', () => {
            cy.get('.content-top .content-top-actions button', { timeout: 15000 }).should('contain', 'Send money')
        })
    })

    describe('In content-middle', () => {
        it('has a list of accounts', () => {
            cy.get('.content-middle #AccountOverview_Wrapper .list', { timeout: 15000 }).should('exist')

            cy.get('.content-middle #AccountOverview_Wrapper .list [id$=AccountName]', { timeout: 15000 }).each(($el, index) => {
                expect($el.text()).to.match(/Current account \[Fixture\]|Savings account|Credit account/i)
            })

            cy.get('.content-middle #AccountOverview_Wrapper .list > :first-child .card .border-size-s', { timeout: 15000 }).should('exist')
        })

        describe('In list-transactions', () => {
            it('has a search input', () => {
                cy.get('.content-middle .list-transactions .search input', { timeout: 15000 }).should('exist')
            })

            it('has start date and end date inputs', () => {
                cy.get('.content-middle .list-transactions input#Input_DisplayStartInterval', { timeout: 15000 }).should('have.attr', 'placeholder', 'Posting date from')
                cy.get('.content-middle .list-transactions input#ListTransactions_EndInput', { timeout: 15000 }).should('have.attr', 'placeholder', 'Posting date to')
            })

            it('has a scrubber of min and max values', () => {
                cy.get('.content-middle .list-transactions #ListTransactions_Amount', { timeout: 15000 }).should('exist')
            })

            it('has a disabled reset button', () => {
                cy.get('.content-middle .list-transactions button#ListTransactions_Desktop_ResetFilters', { timeout: 15000 }).should('be.disabled')
            })

            it('has one item in the table', () => {
                cy.get('.content-middle .list-transactions table tbody tr', { timeout: 15000 }).should('have.length', 1)
            })
        })
    })
})
