var lwip = require('lwip'),
    VError = require('verror');

// opts.width and opts.height must be defined.
// opts.colour (background colour) will default to the colour at position 0,0 in the image.
// opts.transparentColour will replace a transparent background with the colour specified.
// NOTE: colours are specified in rgba, ie {r:0,g:0,b:0,a:100} (0-255 for rgb, 0-100 for alpha).
module.exports = function processImage(imageData, type, opts, callback) {
  lwip.open(imageData, type, function(err, image) {
    if (err) {
      return callback(new VError(err, 'Opening image data failed.'));
    }

    var width = opts.width,
        height = opts.height,
        colour = opts.colour || image.getPixel(0, 0);

    image.batch().
      contain(height, height, colour).
      pad(width - height, 0, 0, 0, colour).
      exec(handleTransparency);

    function handleTransparency(err, image) {
      if (err) return callback(err);

      if (opts.transparentColour) {
        lwip.create(width, height, opts.transparentColour).batch().
          paste(0, 0, image).
          toBuffer('png', callback);
      } else {
        image.toBuffer('png', callback);
      }
    }
  });
};

// vim: set et sw=2:
