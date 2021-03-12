#!/usr/bin/env bash

codecov_file="${GITHUB_WORKSPACE}/scripts/codecov.sh"

curl -s https://codecov.io/bash > $codecov_file
chmod +x $codecov_file

cd "${GITHUB_WORKSPACE}/packages";

for dir in */
  do
    package="${dir/\//}"
    if [ -d "$package/coverage" ]
      then
        file="$PWD/$package/coverage/lcov.info"
        flag="${package/-/_}"
        $codecov_file -f $file -F $flag -v -t $CODECOV_TOKEN
      fi
  done