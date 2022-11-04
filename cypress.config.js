import { defineConfig } from "cypress";
import fs from "fs";

function updateRSSFile(company, urn, url, description) {
  console.log(company, urn, description)

  const content = `<rss version="2.0">
  <channel>
      <title>${company}</title>
      <link>https://www.linkedin.com/company/${company}</link>
      <description>${company}</description>
      <item>
        <title>${urn}</title>
        <link>${url}</link>
        <description>${description}</description>
      </item>
  </channel>
  </rss>`;
  fs.writeFile(`feeds/${company}.xml`, content);
}

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
        add ({company, urn, url, description}) {
          updateRSSFile(company, urn, url, description);
          return null
        }
      })
    },
  },
});
