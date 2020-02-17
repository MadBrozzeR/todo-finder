const test = require('mbr-test').test;
const getTodos = require('./todo-finder.js');

const matchFiles = ['test/test-file1.js', 'test/test-file2.jsx'];

test({
  'Should return correct collection': function (success, fail) {
    getTodos({
      path: 'test',
      exts: ['js', 'jsx']
    }, function (error, result) {
      const files = Object.keys(result);
      if (files.length !== 2) {
        fail('Missmatch file number: \n' + files.toString() + '\n' + matchFiles.toString());
      } else if (files[matchFiles[1]][0].lines[0].index === 6) {
        fail();
      }
    });
  }
});
