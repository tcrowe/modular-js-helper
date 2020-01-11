const assert = require("assert");
const path = require("path");
const sourceFileList = require("../../src/lib/source-file-list");
const extensions = "js";
const sourcePath = path.join(__dirname, "..", "..", "src");
const excludes = ["squeeze"];
const type = "source";

describe("sourceFileList", function() {
  it("list", function(done) {
    sourceFileList({ sourcePath, extensions, excludes }, function(err, list) {
      assert.equal(err, null);
      // console.log("list", list);
      list.forEach(function(item) {
        item.type.should.eql(type);
        item.name.should.be.a.String();
        // item.name.includes("squeeze").should.be.false();
      });
      done();
    });
  });
});
