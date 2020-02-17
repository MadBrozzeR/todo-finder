#! /usr/bin/env node

const Process = require('mbr-proc');
const getTodos = require('../todo-finder').getTodos;

const args = new Process(process).getArgumentOptions({ path: '.', ext: '', full: false });

const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const CLEAR = '\x1b[0m';

getTodos({
  path: args.path,
  exts: args.ext ? args.ext.split(',') : null
}, function (error, result) {
  for (let file in result) {
    const fileName = GREEN + file + CLEAR;
    for (let index = 0 ; index < result[file].length ; ++index) {
      if (args.full) {
        process.stdout.write(fileName + RED + ':' + result[file][index].index + CLEAR + '\n');
        process.stdout.write(result[file][index].full + '\n\n');
      } else {
        for (let line = 0 ; line < result[file][index].lines.length ; ++line) {
          const todoLine = result[file][index].lines[line];
          process.stdout.write(fileName + RED + ':' + todoLine.index + CLEAR + '\n');
          process.stdout.write('  ' + todoLine.data + '\n\n');
        }
      }
    }
  }
});
