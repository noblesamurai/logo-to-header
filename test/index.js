var expect = require('expect.js'),
    logoToHeader = require('..');

describe('logo-to-header', function() {
  it('should say hello', function(done) {
    expect(logoToHeader()).to.equal('Hello, world');
    done();
  });
});
