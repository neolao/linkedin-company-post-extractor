#!/bin/bash

while true
do
  date

  npm run cypress:run

  echo "Next run: ${date -d "+6 hours"}"
  # 60 * 60 * 6 = 21600
  sleep 21600
done
