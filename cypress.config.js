import { defineConfig } from "cypress"
import axios from "axios"

export default defineConfig({
  video: true,
  videoCompression: 16,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
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
