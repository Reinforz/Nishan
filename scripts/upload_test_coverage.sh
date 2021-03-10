#!/usr/bin/env bash

curl -s https://codecov.io/bash > "${GITHUB_WORKSPACE}/scripts/codecov.sh"
chmod +x codecov.sh

cd "${GITHUB_WORKSPACE}/packages";

for dir in */
  do
    package="${dir/\//}"
    if [ -d "$package/coverage" ]
      then
        file="$PWD/$package/coverage/lcov.info"
        flag="${package/-/_}"
        "${GITHUB_WORKSPACE}/scripts/codecov.sh" -f $file -F $flag -v -t $CODECOV_TOKEN
      fi
  done