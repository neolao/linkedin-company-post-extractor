import { defineConfig } from "cypress";

export default defineConfig({
  video: true,
  videoCompression: 16,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
  e2e: {
    supportFile: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        log (message) {
          console.log('plop', message)
          return null
        }
      })
    },
  },
});
