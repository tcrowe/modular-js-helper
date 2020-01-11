const squeeze = require("../../src/lib/squeeze");

describe("squeeze", function() {
  it("list", function() {
    const arr = [["one", "one"], "one"];
    const op = squeeze(arr);
    op.length.should.eql(1);
    op[0].should.be.eql("one");
  });
});
