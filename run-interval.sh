#!/bin/bash

set -xe

while true
do
  date +"%Y-%m-%d %T"

  npm run cypress:run -- --env COMPANIES_START_INDEX=0,COMPANIES_END_INDEX=4
  npm run cypress:run -- --env COMPANIES_START_INDEX=5,COMPANIES_END_INDEX=9
  npm run cypress:run -- --env COMPANIES_START_INDEX=10,COMPANIES_END_INDEX=14

  if [ -f "post.sh" ]; then
    ./post.sh
  fi

  nextDate=$(date +"%Y-%m-%d %T" -d "+24 hours")
  echo "Next run: $nextDate"
  # 60 * 60 * 6  = 21600
  # 60 * 60 * 24 = 86400
  # 60 * 60 * 23 = 82800
  sleep 82800
done
