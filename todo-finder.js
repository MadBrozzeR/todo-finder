const recursive = require('recoursive').recursive;

const COMMENT_RE = /\/\*([\w\W]*?)\*\/|\/\/(.*)/g;
const TODO_RE = /\bTODO\s.+/g;
const NOT_LF_RE = /[^\n]/g;

function getLineNumber(data, index) {
  return data.substr(0, index).replace(NOT_LF_RE, '').length + 1;
}

function getExtensions(array) {
  let extensions = null;

  if (array instanceof Array) {
    extensions = {};

    for (let index = 0 ; index < array.length ; ++index) {
      extensions[array[index]] = null;
    }
  }

  return extensions;
}

function getTodos(options, callback) {
  const path = options.path;
  const extensions = getExtensions(options.exts);
  const result = {};

  recursive({
    error: function (error) {
      callback(error);
    },
    eachFile: function (file, done) {
      const dotPosition = file.name.lastIndexOf('.');
      const extension = dotPosition > -1 ? file.name.substr(dotPosition + 1) : '';

      if (!extensions || extension in extensions) {
        file.read(function (error, data) {
          if (error) {
            callback(error);
          } else {
            let regMatch;
            data = data.toString();
            const blocks = [];

            while (regMatch = COMMENT_RE.exec(data)) {
              let regMatch2;
              let block = null;
              const text = regMatch[1] || regMatch[2];

              while (regMatch2 = TODO_RE.exec(text)) {
                if (!result[file.fullname]) {
                  result[file.fullname] = blocks;
                }
                if (!block) {
                  block = { full: text, index: getLineNumber(data, regMatch.index), lines: [] };
                  blocks.push(block);
                }
                block.lines.push({
                  data: regMatch2[0],
                  index: getLineNumber(data, regMatch.index + regMatch2.index + 2)
                });
              }
            }
          }
          done();
        });
      } else {
        done();
      }
    }
  }).readdir(path, function () {
    callback(null, result);
  });
}

module.exports = {getTodos};
