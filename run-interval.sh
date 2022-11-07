#!/bin/bash

while true
do
  date +"%Y-%m-%d %T"

  npm run cypress:run

  nextDate=$(date +"%Y-%m-%d %T" -d "+24 hours")
  echo "Next run: $nextDate"
  # 60 * 60 * 6  = 21600
  # 60 * 60 * 24 = 86400
  sleep 86400
done
