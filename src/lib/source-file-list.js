const searchFilenames = require("search-filenames");
const type = "source";

/**
 * List all the files in the user's src(source) directory
 * @param {string} sourcePath
 * @param {string} extensions
 * @param {array} excludes
 * @param {function} done
 */
function sourceFileList({ sourcePath, extensions, excludes }, done) {
  const searchOpts = {
    rootPath: sourcePath,
    statTypes: ["file"],
    includeGlobs: [`*.{${extensions}}`],
    excludes
  };

  const searcher = searchFilenames(searchOpts);
  let items = [];
  searcher.on("error", err => console.error("error searching files", err));
  searcher.on("file", file => items.push(file));
  searcher.on("end", function() {
    items = items.map(name => ({ type, name }));
    done(null, items);
  });
  searcher.start();
}

module.exports = sourceFileList;
