var expect = require('expect.js'),
    fs = require('fs'),
    logoToHeader = require('..');

describe('logo-to-header', function() {
  it('should process an image', function(done) {
    fs.readFile(__dirname + '/fixtures/alliance.png', function(err, data) {
      if (err) return done(err);

      logoToHeader(data, 'png', expectations);

      function expectations(err, data) {
        if (err) return done(err);
        expect(data).to.be.a(Buffer);
        done();
      }
    });
  });
});

// vim: set et sw=2:
