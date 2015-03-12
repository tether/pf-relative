var timeAgo = require('timeago');
var strftime = require('strftime');

var options = require('./options');
var refreshRate = require('./refresh.rate');
var noop = function noop () {};

module.exports = function RelativeDate (date) {
  if (!(this instanceof RelativeDate)) return new RelativeDate(date);
  date = date ? new Date(date) : new Date();

  var listener = noop;
  this.onTick = function onTick (newListener) {
    listener = newListener;
  };

  function tick () {
    var diff = Date.now() - date.getTime();
    var madeCutoff = diff > options.cutoff;

    var relative = madeCutoff ? strftime(options.cutoffFormat, date) : timeAgo(date);
    var nextTick = madeCutoff ? null : refreshRate(diff);

    listener.call(this, relative);
    if (nextTick) setTimeout(tick, nextTick);
  }

  setTimeout(tick, 0);
};
