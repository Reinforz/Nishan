#!/usr/bin/env bash

CODECOV_SCRIPT="${GITHUB_WORKSPACE}/scripts/codecov.sh"

curl -s https://codecov.io/bash > $CODECOV_SCRIPT
chmod +x $CODECOV_SCRIPT

cd "${GITHUB_WORKSPACE}/packages";

for dir in */
  do
    if [ -d "${dir}coverage" ]
    then
      $CODECOV_SCRIPT -f "$PWD/$package/coverage/lcov.info" -v -t $CODECOV_TOKEN
    fi
  done