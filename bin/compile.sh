#!/usr/bin/env bash

PROCESS="compile-react-hoc-validation"
echo "[$PROCESS] Compiling ES6 to ES5..." 1>&2;

# Iterate through all .js files in the src directory:
for FILE in $( ls src/*.js ); do
  echo "[$PROCESS] $FILE..." 1>&2;

  # Get the .js file's basename:
  BASENAME=$( echo $FILE | cut -d "/" -f2)

  # Compile the file with babel, saving the result to the root directory:
  ./node_modules/.bin/babel $FILE --out-file $BASENAME
done

echo "[$PROCESS] DONE!" 1>&2;
