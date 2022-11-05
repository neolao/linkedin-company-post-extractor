import axios from "axios"
const config = require("../../config.json")

describe('Extract', () => {
  it('should pass', async () => {
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
      cy.task('log', `Parse ${company.name} ...`)

      const companyUrl = `https://www.linkedin.com/company/${company.name}/posts/?feedView=all`
      cy.task('log', `Visit ${companyUrl} ...`)
      cy.visit(companyUrl, visitOptions)

      let urn, description;
      cy.task('log', 'Get post URN')
      cy.get('.feed-shared-update-v2').first().then(($postElement) => {
        urn = $postElement.attr('data-urn')
        cy.task('log', `URN: ${urn}`)
      })
      cy.task('log', 'Get post description')
      cy.get('.feed-shared-update-v2 .feed-shared-update-v2__description-wrapper').first().then(($descriptionElement) => {
        description = $descriptionElement.text()
        cy.task('log', `Description: ${description}`)
      })

      cy.task('log', 'Get post URL: click on menu')
      cy.get('.feed-shared-update-v2 .feed-shared-control-menu button').click()
      cy.wait(2000);

      cy.task('log', 'Get post URL: click on menu entry')
      cy.contains('Copier le lien vers le post').click();
      cy.wait(2000);
      
      cy.task('log', 'Get post URL: get href on link')
      cy.get('.artdeco-toast-item__cta').first().then(($linkElement) => {
        const url = $linkElement.attr('href')
        cy.task('log', `URL: ${url}`)

        cy.task('log', 'Done')
        cy.task('logPost', {name: company.name, urn, url, description})

        const hookData = {id: urn, title: urn, url, description};
        cy.task('log', `Post on hook: ${company.hook} ${JSON.stringify(hookData)}`)
        axios.post(company.hook, hookData)

        cy.wait(2000)
      });
    }
  })
})
