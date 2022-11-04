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
        const urn = $postElement.attr('data-urn')
        let description = "";

        cy.wrap($postElement).get('.feed-shared-update-v2__description-wrapper').then(($descriptionElement) => {
          description = $descriptionElement.text()
        })

        cy.task('log', `Get post URL ...`)
        cy.wrap($postElement).get('.feed-shared-control-menu button').click()
        cy.wait(2000);
        cy.contains('Copier le lien vers le post').click()
        cy.wait(2000);
        cy.contains('Voir le post').click()
        cy.wait(2000)

        const url = cy.url();

        cy.task('add', {company, urn, url, description})
      })
    }
  })
})
