const fs = require("fs");
const path = require("path");
const isNil = require("lodash/isNil");
const parallel = require("async/parallel");
const squeeze = require("./squeeze");

/**
 * List node_modules for each project
 * @param {string} nodeModulesPath
 * @param {function} done
 */
function listNodeModules(nodeModulesPath, done) {
  let items = [];
  fs.readdir(nodeModulesPath, function(err, list) {
    if (isNil(err) === false) {
      console.error("error listing node modules path", nodeModulesPath, err);
      return done(null, items);
    }

    list = list.map(item => item.replace(nodeModulesPath + path.sep, ""));
    const atItems = list.filter(item => item.startsWith("@") === true);
    items = items.concat(list.filter(item => item.startsWith("@") === false));
    const atItemsSteps = atItems.map(
      atItem =>
        function(done) {
          const subPath = path.join(nodeModulesPath, atItem);

          fs.readdir(subPath, function(err, subList) {
            if (isNil(err) === false) {
              console.error("error listing node modules path", subPath, err);
              return done(null, items);
            }

            const op = subList
              .map(item => item.replace(subPath + path.sep, ""))
              .map(function(subListItem) {
                return atItem + "/" + subListItem;
              });

            done(null, op);
          });
        }
    );

    parallel(atItemsSteps, function(err, atItemsRes) {
      if (isNil(err) === false) {
        console.error("error in @ modules item steps", err);
        return done(null, items);
      }

      const type = "node_modules";

      items = items
        .concat(squeeze(atItemsRes))
        .filter(item => item !== ".bin")
        .map(name => ({ type, name }));

      done(null, items);
    });
  });
}

module.exports = listNodeModules;
