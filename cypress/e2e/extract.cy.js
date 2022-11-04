import axios from "axios"
const config = require("../../config.json")

describe('Extract last post', () => {
  it('passes', () => {
    const loginUrl = 'https://www.linkedin.com/login/fr?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin'
    const companyUrl = 'https://www.linkedin.com/company/swile/posts/?feedView=all'
    const visitOptions = {
      failOnStatusCode: false,
      timeout: 60000
    }
    cy.visit(loginUrl, visitOptions)

    cy.get('#username').type(config.username)
    cy.get('#password').type(config.password)
    cy.get('button[type="submit"]').click()

    cy.visit(companyUrl, visitOptions)

    cy.get('.feed-shared-update-v2').first().then(($postElement) => {
      const urn = $postElement.attr('data-urn')
      cy.task('log', urn)

      cy.wrap($postElement).get('.feed-shared-update-v2__description-wrapper').then(($descriptionElement) => {
        const description = $descriptionElement.text()
        cy.task('log', description)
      })
    })
  })
})
