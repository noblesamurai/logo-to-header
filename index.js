var lwip = require('lwip'),
    VError = require('verror'); // Ability to nest errors.

// opts.width and opts.height must be defined.
// opts.colour (background colour) will default to the colour at position 0,0 in the image.
// opts.transparentColour will replace a transparent background with the colour specified.
// opts.pad will add that many pixels padding around the image
// NOTE: colours are specified in rgba, ie {r:0,g:0,b:0,a:100} (0-255 for rgb, 0-100 for alpha).
module.exports = function processImage(imageData, type, opts, callback) {
  lwip.open(imageData, type, function(err, image) {
    if (err) {
      return callback(new VError(err, 'Opening image data failed.'));
    }

    var width = opts.width,
        height = opts.height,
        pad = opts.pad || 0,
        colour = opts.colour || image.getPixel(0, 0),
        borderWidths = opts.borderWidths || {},
        borderColour = opts.borderColour || colour;

    // construct inner width and height excluding borders
    var innerWidth = width - (borderWidths.left || 0) - (borderWidths.right || 0),
        innerHeight = height - (borderWidths.top || 0) - (borderWidths.bottom || 0);

    image.batch().
      // Resize image while maintaining aspect ratio.
      // We want to fix it within a square given by the height of the banner,
      // less any padding.
      contain(innerHeight - (pad * 2), innerHeight - (pad * 2), colour).
      // Now add the padding around the original image so it's not hard against
      // the edge of the banner.
      pad(pad, pad, pad, pad, colour).
      // Now pad out the LHS by width - height, in order to get the full width.
      pad(innerWidth - innerHeight, 0, 0, 0, colour).
      // Now add the border
      pad(borderWidths.left || 0, borderWidths.top || 0,
          borderWidths.right || 0, borderWidths.bottom || 0,
          borderColour).
      // Excute the batched operations.
      exec(handleTransparency);

    function handleTransparency(err, image) {
      if (err) return callback(err);

      if (opts.transparentColour) {
        // Replace transparency with the requested colour.
        lwip.create(width, height, opts.transparentColour, function(err, background) {
          if (err) return callback(err);
          background.batch().
            paste(0, 0, image).
            toBuffer('png', callback);
        });
      } else {
        image.toBuffer('png', callback);
      }
    }
  });
};

// vim: set et sw=2:
