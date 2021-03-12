#!/usr/bin/env bash

CODECOV_SCRIPT="${GITHUB_WORKSPACE}/scripts/codecov.sh"
FILES=""

curl -s https://codecov.io/bash > $CODECOV_SCRIPT
chmod +x $CODECOV_SCRIPT

cd "${GITHUB_WORKSPACE}/packages";

for dir in */
  do
    package="${dir/\//}"
    if [ -d "$package/coverage" ]
      then
        FILES="${FILES},$PWD/$package/coverage/lcov.info"
      fi
  done

if [ ! -z "$FILES" ]
then
  $CODECOV_SCRIPT -f $FILES -v -t $CODECOV_TOKEN
fi