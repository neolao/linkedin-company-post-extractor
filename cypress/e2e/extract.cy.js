const config = require("../../config.json")

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

describe('Extract', () => {
  it('should pass', () => {
    cy.task('log', `COMPANIES_START_INDEX: ${Cypress.env('COMPANIES_START_INDEX')}`)
    cy.task('log', `COMPANIES_END_INDEX: ${Cypress.env('COMPANIES_END_INDEX')}`)

    const visitOptions = {
      failOnStatusCode: false,
      timeout: 60000
    }

    // Set cookies from config
    if (config.cookies) {
      for (let cookieName in config.cookies) {
        cy.task('log', `Set cookie "${cookieName}": ${config.cookies[cookieName]}`)
        cy.setCookie(cookieName, config.cookies[cookieName])
      }
    }

    // Set cookies from last
    cy.readFile('cookie_li_at').then((value) => {
        cy.task('log', `Set cookie "li_at": ${value}`)
	cy.setCookie('li_at', value.trim() )
    })
    cy.readFile('cookie_lidc').then((value) => {
        cy.task('log', `Set cookie "lidc": ${value}`)
	cy.setCookie('lidc', value.trim() )
    })
    cy.readFile('cookie_li_mc').then((value) => {
        cy.task('log', `Set cookie "li_mc": ${value}`)
	cy.setCookie('li_mc', value.trim())
    })
    cy.readFile('cookie_JSESSIONID').then((value) => {
        cy.task('log', `Set cookie "JSESSIONID": ${value}`)
	cy.setCookie('JSESSIONID', value.trim())
    })

    const homepageUrl = 'https://www.linkedin.com/'
    cy.visit(homepageUrl, visitOptions)
    /*
    cy.task('log', 'Login ...')
    const loginUrl = 'https://www.linkedin.com/login/fr?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin'
    cy.visit(loginUrl, visitOptions)

    cy.get('#username').type(config.username)
    cy.get('#password').type(config.password)
    cy.get('button[type="submit"]').click()
    */

    /*
    // Procédons à une petite vérification de sécurité
    // #home_children_button
    cy.wait(30000)
    cy.get('body').then(($bodyElement) => {
      if ($bodyElement.find('#home_children_button').length > 0) {
        cy.task('log', 'Check robot ...')
        cy.get('#home_children_button').click();
        cy.wait(1000)
        cy.get('#image5 a').click()
      } else {
        
      }
    })
    */

    cy.get('.feed-shared-control-menu', {timeout: 10000}).should('exist')


    // Update cookies
    /*
    cy.getAllCookies().then((cookies) => {
	for (let cookie of cookies) {
           cy.task('log', cookie);
	}
    });
    */
    cy.getCookie('li_at').then((cookie) => {
	cy.writeFile('cookie_li_at', cookie.value);	
    });
    cy.getCookie('lidc').then((cookie) => {
	cy.writeFile('cookie_lidc', cookie.value);	
    });
    cy.getCookie('li_mc').then((cookie) => {
	cy.writeFile('cookie_li_mc', cookie.value);	
    });
    cy.getCookie('JSESSIONID').then((cookie) => {
	cy.writeFile('cookie_JSESSIONID', cookie.value);	
    });

    //for (let company of config.companies) {
    for (let index = 0; index < config.companies.length; index++) {
      if (Cypress.env('COMPANIES_START_INDEX') !== undefined && index < Cypress.env('COMPANIES_START_INDEX')) {
        continue;
      }

      if (Cypress.env('COMPANIES_END_INDEX') !== undefined && index > Cypress.env('COMPANIES_END_INDEX')) {
        continue;
      }

      const company = config.companies[index];
      cy.task('log', `--------`)
      cy.task('log', `Parse ${company.name} (index: ${index}) ...`)

      const companyUrl = `https://www.linkedin.com/company/${company.name}/posts/?feedView=all`
      cy.task('log', `Visit ${companyUrl} ...`)
      cy.visit(companyUrl, visitOptions)

      let urn, description;
      cy.task('log', 'Get post URN')
      cy.get('.feed-shared-update-v2').first().then(($postElement) => {
        urn = $postElement.attr('data-urn')
        cy.task('log', `URN: ${urn}`)

        cy.task('log', 'Try to get post description')
        if ($postElement.find('.feed-shared-update-v2__description-wrapper').length > 0) {
          cy.get('.feed-shared-update-v2 .feed-shared-update-v2__description-wrapper').first().then(($descriptionElement) => {
            description = $descriptionElement.text()
            cy.task('log', `Description: ${description}`)
          })
        }
      })
      /*
      cy.task('log', 'Get post description')
      cy.get('.feed-shared-update-v2 .feed-shared-update-v2__description-wrapper').first().then(($descriptionElement) => {
        description = $descriptionElement.text()
        cy.task('log', `Description: ${description}`)
      })
      */

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

        cy.task('logPost', {company: company.name, urn, url, description})

        const hookData = {id: urn, title: urn, url, description}
        cy.task('log', `Post on hook: ${company.hook} ${JSON.stringify(hookData)}`)
        cy.wait(100).then(() => {
          cy.task('hook', {url: company.hook, data: hookData})
        });
        
      });
    }
  })
})
