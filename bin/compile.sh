#!/usr/bin/env bash

PROCESS="compile-react-hoc-validation"
echo "[$PROCESS] Compiling ES6 to ES5..." 1>&2;

for FILE in $( ls src ); do
  echo "[$PROCESS] $FILE..." 1>&2;
  ./node_modules/.bin/babel src/$FILE --out-file $FILE
done

echo "[$PROCESS] DONE!" 1>&2;
