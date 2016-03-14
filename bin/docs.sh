#!/usr/bin/env node
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const PROCESS = 'compile-documentation';

console.error('[%s] Building documentation...', PROCESS);

const docs = fs.statSync('docs');

if (!docs) {
  fs.mkdirSync('docs');
}

fs.readdirSync('src').forEach(function(filename) {
  const src = fs.readFileSync('src/' + filename).toString();
  var comments = [];

  var isComment = false;
  var current = '';

  src.split(/\n/).forEach(function(line) {
    if (!isComment && /\/\*/.test(line)) {
      // New comment detected
      isComment = true;
      current = '';

    } else if (isComment && /\*\//.test(line)) {
      // END comment detected
      isComment = false
      comments.push(current);

    } else if (isComment && /^(\s+)?\*/.test(line)) {
      // Subsequent comment line detected
      current += line.replace(/^(\s+)?\* ?/, '') + '\n';
    }

    // console.log(isComment, line)
  });

  if (comments.length > 0) {
    var content = comments.join('\n\n');
    fs.writeFileSync('docs/' + filename + '.md', content);
  }
});
