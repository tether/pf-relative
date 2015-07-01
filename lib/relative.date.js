var timeAgo = require('timeago');
var strftime = require('strftime');

var options = require('./options');
var refreshRate = require('./refresh.rate');
var noop = function noop () {};

module.exports = function RelativeDate (date) {
  if (!(this instanceof RelativeDate)) return new RelativeDate(date);

  var lastTick = null;
  var listener = noop;

  this.onTick = function onTick (newListener) {
    listener = newListener;
  };

  this.setDate = function setDate (newDate) {
    date = newDate ? new Date(newDate) : new Date();
    tick();
  };

  function clearTick () {
    clearTimeout(lastTick);
  }

  this.clearTick = clearTick;

  function tick () {
    var diff = Date.now() - date.getTime();
    var madeCutoff = diff > options.cutoff;

    var relative = madeCutoff ? strftime(options.cutoffFormat, date) : timeAgo(date);
    var nextTick = madeCutoff ? null : refreshRate(diff);

    listener.call(this, relative);
    clearTick();
    if (nextTick) {
      lastTick = setTimeout(tick, nextTick);
    }
  }

  this.setDate(date);
};
