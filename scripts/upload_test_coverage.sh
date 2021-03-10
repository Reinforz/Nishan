#!/usr/bin/env bash

curl -s https://codecov.io/bash > codecov.sh
chmod +x codecov.sh

cd "../packages";

for dir in */
  do
    package="${dir/\//}"
    if [ -d "$package/coverage" ]
      then
        file="$PWD/$package/coverage/lcov.info"
        flag="${package/-/_}"
        echo "$file $flag"
        ../scripts/codecov.sh -f $file -F $flag
      fi
  done