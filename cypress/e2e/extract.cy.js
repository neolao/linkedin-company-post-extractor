const config = require("../../config.json")

describe('Extract', () => {
  it('should pass', () => {
    const visitOptions = {
      failOnStatusCode: false,
      timeout: 60000
    }
    const loginUrl = 'https://www.linkedin.com/login/fr?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin'
    cy.visit(loginUrl, visitOptions)

    cy.get('#username').type(config.username)
    cy.get('#password').type(config.password)
    cy.get('button[type="submit"]').click()

    for ( let company of config.companies) {
      cy.task('log', `Parse ${company} ...`)

      const companyUrl = `https://www.linkedin.com/company/${company}/posts/?feedView=all`
      cy.task('log', `Visit ${companyUrl} ...`)
      cy.visit(companyUrl, visitOptions)

      cy.get('.feed-shared-update-v2').first().then(($postElement) => {
        cy.task('log', 'Get post URN')
        const urn = $postElement.attr('data-urn')
        let description = "";

        cy.task('log', 'Get post description')
        cy.wrap($postElement).get('.feed-shared-update-v2__description-wrapper').then(($descriptionElement) => {
          description = $descriptionElement.text()
        })

        cy.task('log', 'Get post URL: click on menu')
        cy.wrap($postElement).get('.feed-shared-control-menu button').click()
        cy.wait(1000);
        cy.task('log', 'Get post URL: get href on link')
        cy.get('.artdeco-toast-item__cta').first().then(($linkElement) => {
          const url = $linkElement.attr('href')

          cy.task('log', 'Done')
          cy.task('logPost', {company, urn, url, description})
        });
      })
    }
  })
})
