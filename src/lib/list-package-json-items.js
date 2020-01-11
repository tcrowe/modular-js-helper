const fs = require("fs");
const isNil = require("lodash/isNil");
const type = "package.json";

/**
 * List dependencies and devDependencies in package.json in each project.
 * @param {string} packageJsonPath
 * @param {function} done
 */
function listPackageJsonItems(packageJsonPath, done) {
  let items = [];
  fs.exists(packageJsonPath, function(exists) {
    if (exists === false) {
      return done(null, items);
    }

    fs.readFile(packageJsonPath, { encoding: "utf8" }, function(err, source) {
      if (isNil(err) === false) {
        console.error("error reading package.json", packageJsonPath, err);
        return done(null, items);
      }

      let pkg = {};

      try {
        pkg = JSON.parse(source);
      } catch (e) {
        console.error("error parsing", packageJsonPath, err);
        return done(null, items);
      }

      if (isNil(pkg.dependencies) === false) {
        const deps = Object.keys(pkg.dependencies).map(function(name) {
          const subType = "dependencies";
          return { type, subType, name };
        });
        items = items.concat(deps);
      }

      if (isNil(pkg.devDependencies) === false) {
        const devDeps = Object.keys(pkg.devDependencies).map(function(name) {
          const subType = "devDependencies";
          return { type, subType, name };
        });
        items = items.concat(devDeps);
      }

      // items = items.map(name => ({ type, subType, name }));
      done(null, items);
    });
  });
}

module.exports = listPackageJsonItems;
