const assert = require("assert");
const path = require("path");
const listNodeModules = require("../../src/lib/list-node-modules.js");
const nodeModulesPath = path.join(__dirname, "..", "..", "node_modules");
const type = "node_modules";

describe("listNodeModules", function() {
  it("list", function(done) {
    listNodeModules(nodeModulesPath, function(err, list) {
      assert.equal(err, null);
      list.forEach(function(item) {
        item.type.should.eql(type);
        item.name.should.be.a.String();
      });
      done();
    });
  });
});
