var one = require('./one');
var ms = require('milliseconds');
var xtend = require('object-extend');

var defaults = module.exports = {
  cutoff       : Infinity,
  cutoffFormat : '%B %d, %Y',
  refreshRates : {
    now        : one.millisecond,
    second     : one.second,
    minute     : one.minute,
    hour       : one.hour,
    day        : one.day,
    weeks      : one.week,
    months     : one.month,
    years      : one.year
  }
};

defaults.extend = function extend (options) {
  delete options.extend;
  xtend(this, options);
};
