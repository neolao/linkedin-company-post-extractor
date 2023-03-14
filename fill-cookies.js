import { argv, exit } from 'node:process';
import { writeFileSync } from 'node:fs';

const cookiesString = argv[2];
if (!cookiesString) {
  console.error("Please provide an argument");
  exit(1);
}

const cookies = cookiesString.split(';');

for (const cookie of cookies) {
  const found = cookie.match(/([^=]+)=(.*)/);
  const cookieName = found[1].trim();
  let cookieValue = found[2].trim();
  cookieValue = cookieValue.replace(/^"(.+(?="$))"$/, '$1');
  
  if (["JSESSIONID", "li_at", "li_mc", "lidc"].includes(cookieName)) {
    console.log('Set', cookieName, cookieValue);
    writeFileSync(`cookie_${cookieName}`, cookieValue);
  }
}
