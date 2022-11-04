import axios from "axios";
const config = require("../../config.json");

describe('Extract last post', () => {
  it('passes', () => {
    const loginUrl = 'https://www.linkedin.com/login/fr?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin';
    const companyUrl = 'https://www.linkedin.com/company/swile/posts/?feedView=all';
    cy.visit(loginUrl)

    cy.get('#username').type(config.username)
    cy.get('#password').type(config.password)
    cy.get('button[type="submit"]').click()

    cy.visit(
        companyUrl, 
        {
            failOnStatusCode: false,
            timeout: 60000
        }
    );

    //cy.get('.main-feed-activity-card').invoke('text').then((text) => {
    
    /*
    cy.get('.feed-shared-update-v2 .feed-shared-update-v2__description-wrapper').invoke('text').then((text) => {
        console.log('hop', text);
    });
    */
    cy.get('.feed-shared-update-v2 .feed-shared-update-v2__description-wrapper').then(function($elem) {
        const hop = $elem.text();
        cy.log(hop)
        cy.task('log', hop)
   })
  })
})