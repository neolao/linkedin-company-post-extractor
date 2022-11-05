#!/bin/bash

while true
do
  date +"%Y-%m-%d %T"

  npm run cypress:run

  nextDate=$(date +"%Y-%m-%d %T" -d "+6 hours")
  echo "Next run: $nextDate"
  # 60 * 60 * 6 = 21600
  sleep 21600
done
