#!/usr/bin/env bash

CODECOV_SCRIPT="${GITHUB_WORKSPACE}/scripts/codecov.sh"
FILES=""

curl -s https://codecov.io/bash > $CODECOV_SCRIPT
chmod +x $CODECOV_SCRIPT

cd "${GITHUB_WORKSPACE}/packages";

for dir in */
  do
    if [ -d "${dir}coverage" ]
    then
      FILENAME="$PWD/${dir}coverage/lcov.info"
      if [ -z $FILES ]
      then
        FILES=$FILENAME
      else
        FILES="${FILES},$FILENAME"
      fi
    fi
  done

if [ ! -z "$FILES" ]
then
  $CODECOV_SCRIPT -f $FILES -v -t $CODECOV_TOKEN
fi