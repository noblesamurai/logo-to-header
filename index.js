var lwip = require('lwip'),
    VError = require('verror');
var IMAGE_WIDTH = 2480;
var IMAGE_HEIGHT = 626;

module.exports = function processImage(imageData, type, callback) {
  lwip.open(imageData, type, function(err, image) {
    if (err) {
      return callback(new VError(err, 'Opening image data failed.'));
    }
    var colour = image.getPixel(0,0);
    image.batch().
    contain(IMAGE_HEIGHT, IMAGE_HEIGHT, colour).
    pad(IMAGE_WIDTH - IMAGE_HEIGHT, 0, 0, 0, colour).
    toBuffer('png', callback);
  });
};

// vim: set et sw=2:
