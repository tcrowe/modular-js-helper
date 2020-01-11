const assert = require("assert");
const path = require("path");
const listPackageJsonItems = require("../../src/lib/list-package-json-items.js");
const packageJsonPath = path.join(__dirname, "..", "..", "package.json");
const type = "package.json";
const subTypes = ["dependencies", "devDependencies"];

describe("listPackageJsonItems", function() {
  it("list", function(done) {
    listPackageJsonItems(packageJsonPath, function(err, list) {
      assert.equal(err, null);
      list.should.be.an.Array();
      list.forEach(function(item) {
        item.should.be.an.Object();
        item.type.should.eql(type);
        subTypes.includes(item.subType).should.be.true();
        item.name.should.be.a.String();
      });
      done();
    });
  });
});
