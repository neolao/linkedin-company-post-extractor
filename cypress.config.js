import { defineConfig } from "cypress"
import axios from "axios"

export default defineConfig({
  video: true,
  videoCompression: 16,
  //userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36',
  userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0',
  e2e: {
    pageLoadTimeout: 100000,
    supportFile: false,
    setupNodeEvents(on, config) {
      on('task', {
        log (message) {
          console.log(message)
          return null
        },
        logPost ({company, urn, url, description}) {
          console.log('Crawled:')
          console.log(company, urn, url, description)

          
          return null
        },
        hook ({url, data}) {
          axios.post(url, data, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json;charset=UTF-8"
            }
          })
          return null
        }
      })
    },
  },
});
