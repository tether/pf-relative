(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var RelativeDate = require('./relative.date');

angular.module('pf-relative', [])
.directive('pfRelative', function pfRelative () {
  var directive = {
    restrict: 'A',
    scope: { date: '=pfRelative' }
  };

  directive.link = function link (scope, element) {
    var relative = new RelativeDate(scope.date);
    element.attr('datetime', scope.date);
    relative.onTick(element.text.bind(element));

    scope.$watch('date', relative.setDate);
    element.on('$destroy', relative.destroy);
  };

  return directive;
})

.provider('RelativeDate', function pfRelative () {
  this.$get = function () { return RelativeDate; };
  this.options = require('./options');
  this.one = require('./one');
  this.ms = require('milliseconds');
});

},{"./one":2,"./options":3,"./relative.date":5,"milliseconds":6}],2:[function(require,module,exports){
var ms = require('milliseconds');

module.exports = {
  millisecond : 1,
  second      : ms.seconds(1),
  minute      : ms.minutes(1),
  hour        : ms.hours(1),
  day         : ms.days(1),
  week        : ms.weeks(1),
  month       : ms.months(1),
  year        : ms.years(1)
};

},{"milliseconds":6}],3:[function(require,module,exports){
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

},{"./one":2,"milliseconds":6,"object-extend":7}],4:[function(require,module,exports){
var one = require('./one');
var rate = require('./options').refreshRates;

module.exports = function refreshRate (diff) {
  switch (true) {
    case (diff === 0)        : return rate.now;
    case (diff < one.minute) : return rate.second;
    case (diff < one.hour)   : return rate.minute;
    case (diff < one.day)    : return rate.hour;
    case (diff < one.week)   : return rate.day;
    case (diff < one.month)  : return rate.week;
    case (diff < one.year)   : return rate.month;
    default                  : return rate.year;
  }
};

},{"./one":2,"./options":3}],5:[function(require,module,exports){
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

  this.destroy = function destroy () {
    clearTick();
  };

  function clearTick () {
    clearTimeout(lastTick);
  }

  function tick () {
    var diff = Date.now() - date.getTime();
    var madeCutoff = diff > options.cutoff;

    var relative = madeCutoff ? strftime(options.cutoffFormat, date) : timeAgo(date);
    var nextTick = madeCutoff ? null : refreshRate(diff);

    listener(relative);
    clearTick();
    if (nextTick) {
      lastTick = setTimeout(tick, nextTick);
    }
  }

  this.setDate(date);
};

},{"./options":3,"./refresh.rate":4,"strftime":8,"timeago":9}],6:[function(require,module,exports){
function calc(m) {
    return function(n) { return Math.round(n * m); };
};
module.exports = {
    seconds: calc(1e3),
    minutes: calc(6e4),
    hours: calc(36e5),
    days: calc(864e5),
    weeks: calc(6048e5),
    months: calc(26298e5),
    years: calc(315576e5)
};

},{}],7:[function(require,module,exports){
/*!
 * object-extend
 * A well-tested function to deep extend (or merge) JavaScript objects without further dependencies.
 *
 * http://github.com/bernhardw
 *
 * Copyright 2013, Bernhard Wanger <mail@bernhardwanger.com>
 * Released under the MIT license.
 *
 * Date: 2013-04-10
 */


/**
 * Extend object a with object b.
 *
 * @param {Object} a Source object.
 * @param {Object} b Object to extend with.
 * @returns {Object} a Extended object.
 */
module.exports = function extend(a, b) {

    // Don't touch 'null' or 'undefined' objects.
    if (a == null || b == null) {
        return a;
    }

    // TODO: Refactor to use for-loop for performance reasons.
    Object.keys(b).forEach(function (key) {

        // Detect object without array, date or null.
        // TODO: Performance test:
        // a) b.constructor === Object.prototype.constructor
        // b) Object.prototype.toString.call(b) == '[object Object]'
        if (Object.prototype.toString.call(b[key]) == '[object Object]') {
            if (Object.prototype.toString.call(a[key]) != '[object Object]') {
                a[key] = b[key];
            } else {
                a[key] = extend(a[key], b[key]);
            }
        } else {
            a[key] = b[key];
        }

    });

    return a;

};
},{}],8:[function(require,module,exports){
//
// strftime
// github.com/samsonjs/strftime
// @_sjs
//
// Copyright 2010 - 2013 Sami Samhuri <sami@samhuri.net>
//
// MIT License
// http://sjs.mit-license.org
//

;(function() {

  //// Where to export the API
  var namespace;

  // CommonJS / Node module
  if (typeof module !== 'undefined') {
    namespace = module.exports = strftime;
  }

  // Browsers and other environments
  else {
    // Get the global object. Works in ES3, ES5, and ES5 strict mode.
    namespace = (function(){ return this || (1,eval)('this') }());
  }

  function words(s) { return (s || '').split(' '); }

  var DefaultLocale =
  { days: words('Sunday Monday Tuesday Wednesday Thursday Friday Saturday')
  , shortDays: words('Sun Mon Tue Wed Thu Fri Sat')
  , months: words('January February March April May June July August September October November December')
  , shortMonths: words('Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec')
  , AM: 'AM'
  , PM: 'PM'
  , am: 'am'
  , pm: 'pm'
  };

  namespace.strftime = strftime;
  function strftime(fmt, d, locale) {
    return _strftime(fmt, d, locale);
  }

  // locale is optional
  namespace.strftimeTZ = strftime.strftimeTZ = strftimeTZ;
  function strftimeTZ(fmt, d, locale, timezone) {
    if ((typeof locale == 'number' || typeof locale == 'string') && timezone == null) {
      timezone = locale;
      locale = undefined;
    }
    return _strftime(fmt, d, locale, { timezone: timezone });
  }

  namespace.strftimeUTC = strftime.strftimeUTC = strftimeUTC;
  function strftimeUTC(fmt, d, locale) {
    return _strftime(fmt, d, locale, { utc: true });
  }

  namespace.localizedStrftime = strftime.localizedStrftime = localizedStrftime;
  function localizedStrftime(locale) {
    return function(fmt, d, options) {
      return strftime(fmt, d, locale, options);
    };
  }

  // d, locale, and options are optional, but you can't leave
  // holes in the argument list. If you pass options you have to pass
  // in all the preceding args as well.
  //
  // options:
  //   - locale   [object] an object with the same structure as DefaultLocale
  //   - timezone [number] timezone offset in minutes from GMT
  function _strftime(fmt, d, locale, options) {
    options = options || {};

    // d and locale are optional so check if d is really the locale
    if (d && !quacksLikeDate(d)) {
      locale = d;
      d = undefined;
    }
    d = d || new Date();

    locale = locale || DefaultLocale;
    locale.formats = locale.formats || {};

    // Hang on to this Unix timestamp because we might mess with it directly below.
    var timestamp = d.getTime();

    var tz = options.timezone;
    var tzType = typeof tz;

    if (options.utc || tzType == 'number' || tzType == 'string') {
      d = dateToUTC(d);
    }

    if (tz) {
      // ISO 8601 format timezone string, [-+]HHMM
      //
      // Convert to the number of minutes and it'll be applied to the date below.
      if (tzType == 'string') {
        var sign = tz[0] == '-' ? -1 : 1;
        var hours = parseInt(tz.slice(1, 3), 10);
        var mins = parseInt(tz.slice(3, 5), 10);
        tz = sign * ((60 * hours) + mins);
      }

      if (tzType) {
        d = new Date(d.getTime() + (tz * 60000));
      }
    }

    // Most of the specifiers supported by C's strftime, and some from Ruby.
    // Some other syntax extensions from Ruby are supported: %-, %_, and %0
    // to pad with nothing, space, or zero (respectively).
    return fmt.replace(/%([-_0:]?.)/g, function(_, c) {
      var mod, padding, ext;

      if (c.length == 2) {
        mod = c[0];
        // omit padding
        if (mod == '-') {
          padding = '';
        }
        // pad with space
        else if (mod == '_') {
          padding = ' ';
        }
        // pad with zero
        else if (mod == '0') {
          padding = '0';
        }
        else if (mod == ":") {
          ext = true;
        }
        else {
          // unrecognized, return the format
          return _;
        }
        c = c[1];
      }

      switch (c) {

        // Examples for new Date(0) in GMT

        // 'Thursday'
        case 'A': return locale.days[d.getDay()];

        // 'Thu'
        case 'a': return locale.shortDays[d.getDay()];

        // 'January'
        case 'B': return locale.months[d.getMonth()];

        // 'Jan'
        case 'b': return locale.shortMonths[d.getMonth()];

        // '19'
        case 'C': return pad(Math.floor(d.getFullYear() / 100), padding);

        // '01/01/70'
        case 'D': return _strftime(locale.formats.D || '%m/%d/%y', d, locale);

        // '01'
        case 'd': return pad(d.getDate(), padding);

        // '01'
        case 'e': return pad(d.getDate(), padding == null ? ' ' : padding);

        // '1970-01-01'
        case 'F': return _strftime(locale.formats.F || '%Y-%m-%d', d, locale);

        // '00'
        case 'H': return pad(d.getHours(), padding);

        // 'Jan'
        case 'h': return locale.shortMonths[d.getMonth()];

        // '12'
        case 'I': return pad(hours12(d), padding);

        // '000'
        case 'j':
          var y = new Date(d.getFullYear(), 0, 1);
          var day = Math.ceil((d.getTime() - y.getTime()) / (1000 * 60 * 60 * 24));
          return pad(day, 3);

        // ' 0'
        case 'k': return pad(d.getHours(), padding == null ? ' ' : padding);

        // '000'
        case 'L': return pad(Math.floor(timestamp % 1000), 3);

        // '12'
        case 'l': return pad(hours12(d), padding == null ? ' ' : padding);

        // '00'
        case 'M': return pad(d.getMinutes(), padding);

        // '01'
        case 'm': return pad(d.getMonth() + 1, padding);

        // '\n'
        case 'n': return '\n';

        // '1st'
        case 'o': return String(d.getDate()) + ordinal(d.getDate());

        // 'am'
        case 'P': return d.getHours() < 12 ? locale.am : locale.pm;

        // 'AM'
        case 'p': return d.getHours() < 12 ? locale.AM : locale.PM;

        // '00:00'
        case 'R': return _strftime(locale.formats.R || '%H:%M', d, locale);

        // '12:00:00 AM'
        case 'r': return _strftime(locale.formats.r || '%I:%M:%S %p', d, locale);

        // '00'
        case 'S': return pad(d.getSeconds(), padding);

        // '0'
        case 's': return Math.floor(timestamp / 1000);

        // '00:00:00'
        case 'T': return _strftime(locale.formats.T || '%H:%M:%S', d, locale);

        // '\t'
        case 't': return '\t';

        // '00'
        case 'U': return pad(weekNumber(d, 'sunday'), padding);

        // '4'
        case 'u':
          var day = d.getDay();
          return day == 0 ? 7 : day; // 1 - 7, Monday is first day of the week

        // ' 1-Jan-1970'
        case 'v': return _strftime(locale.formats.v || '%e-%b-%Y', d, locale);

        // '00'
        case 'W': return pad(weekNumber(d, 'monday'), padding);

        // '4'
        case 'w': return d.getDay(); // 0 - 6, Sunday is first day of the week

        // '1970'
        case 'Y': return d.getFullYear();

        // '70'
        case 'y':
          var y = String(d.getFullYear());
          return y.slice(y.length - 2);

        // 'GMT'
        case 'Z':
          if (options.utc) {
            return "GMT";
          }
          else {
            var tzString = d.toString().match(/\(([\w\s]+)\)/);
            return tzString && tzString[1] || '';
          }

        // '+0000'
        case 'z':
          if (options.utc) {
            return ext ? "+00:00" : "+0000";
          }
          else {
            var off = typeof tz == 'number' ? tz : -d.getTimezoneOffset();
            var sep = ext ? ":" : ""; // separator for extended offset
            return (off < 0 ? '-' : '+') + pad(Math.floor(Math.abs(off) / 60)) + sep + pad(Math.abs(off) % 60);
          }

        default: return c;
      }
    });
  }

    function dateToUTC(d) {
      var year = d.getUTCFullYear();
      var date = new Date(
        year,
        d.getUTCMonth(),
        d.getUTCDate(),
        d.getUTCHours(),
        d.getUTCMinutes(),
        d.getUTCSeconds(),
        d.getUTCMilliseconds()
      );
      // In old dates, years is incorrectly interpreted as a 2-digit year with base 1900.
      // Correct this by setting the year explicitly after the fuzzy creation process.
      if (date.getFullYear() != year) {
        date.setFullYear(year);
      }
      return date;
    }

  var RequiredDateMethods = ['getTime', 'getTimezoneOffset', 'getDay', 'getDate', 'getMonth', 'getFullYear', 'getYear', 'getHours', 'getMinutes', 'getSeconds'];
  function quacksLikeDate(x) {
    var i = 0
      , n = RequiredDateMethods.length
      ;
    for (i = 0; i < n; ++i) {
      if (typeof x[RequiredDateMethods[i]] != 'function') {
        return false;
      }
    }
    return true;
  }

  // Default padding is '0' and default length is 2, both are optional.
  function pad(n, padding, length) {
    // pad(n, <length>)
    if (typeof padding === 'number') {
      length = padding;
      padding = '0';
    }

    // Defaults handle pad(n) and pad(n, <padding>)
    if (padding == null) {
      padding = '0';
    }
    length = length || 2;

    var s = String(n);
    // padding may be an empty string, don't loop forever if it is
    if (padding) {
      while (s.length < length) s = padding + s;
    }
    return s;
  }

  function hours12(d) {
    var hour = d.getHours();
    if (hour == 0) hour = 12;
    else if (hour > 12) hour -= 12;
    return hour;
  }

  // Get the ordinal suffix for a number: st, nd, rd, or th
  function ordinal(n) {
    var i = n % 10
      , ii = n % 100
      ;
    if ((ii >= 11 && ii <= 13) || i === 0 || i >= 4) {
      return 'th';
    }
    switch (i) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
    }
  }

  // firstWeekday: 'sunday' or 'monday', default is 'sunday'
  //
  // Pilfered & ported from Ruby's strftime implementation.
  function weekNumber(d, firstWeekday) {
    firstWeekday = firstWeekday || 'sunday';

    // This works by shifting the weekday back by one day if we
    // are treating Monday as the first day of the week.
    var wday = d.getDay();
    if (firstWeekday == 'monday') {
      if (wday == 0) // Sunday
        wday = 6;
      else
        wday--;
    }
    var firstDayOfYear = new Date(d.getFullYear(), 0, 1)
      , yday = (d - firstDayOfYear) / 86400000
      , weekNum = (yday + 7 - wday) / 7
      ;
    return Math.floor(weekNum);
  }

}());

},{}],9:[function(require,module,exports){
/*
 * node-timeago
 * Cam Pedersen
 * <diffference@gmail.com>
 * Oct 6, 2011
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 0.10.0
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2011, Ryan McGeary (ryanonjavascript -[at]- mcgeary [*dot*] org)
 */
module.exports = function (timestamp) {
  if (timestamp instanceof Date) {
    return inWords(timestamp);
  } else if (typeof timestamp === "string") {
    return inWords(parse(timestamp));
  } else if (typeof timestamp === "number") {
    return inWords(new Date(timestamp))
  }
};

var settings = {
  allowFuture: false,
  strings: {
    prefixAgo: null,
    prefixFromNow: null,
    suffixAgo: "ago",
    suffixFromNow: "from now",
    seconds: "less than a minute",
    minute: "about a minute",
    minutes: "%d minutes",
    hour: "about an hour",
    hours: "about %d hours",
    day: "a day",
    days: "%d days",
    month: "about a month",
    months: "%d months",
    year: "about a year",
    years: "%d years",
    numbers: []
  }
};

var $l = settings.strings;

module.exports.settings = settings;

$l.inWords = function (distanceMillis) {
  var prefix = $l.prefixAgo;
  var suffix = $l.suffixAgo;
  if (settings.allowFuture) {
    if (distanceMillis < 0) {
      prefix = $l.prefixFromNow;
      suffix = $l.suffixFromNow;
    }
  }

  var seconds = Math.abs(distanceMillis) / 1000;
  var minutes = seconds / 60;
  var hours = minutes / 60;
  var days = hours / 24;
  var years = days / 365;

  function substitute (stringOrFunction, number) {
    var string = typeof stringOrFunction === 'function' ? stringOrFunction(number, distanceMillis) : stringOrFunction;
    var value = ($l.numbers && $l.numbers[number]) || number;
    return string.replace(/%d/i, value);
  }

  var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
    seconds < 90 && substitute($l.minute, 1) ||
    minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
    minutes < 90 && substitute($l.hour, 1) ||
    hours < 24 && substitute($l.hours, Math.round(hours)) ||
    hours < 48 && substitute($l.day, 1) ||
    days < 30 && substitute($l.days, Math.floor(days)) ||
    days < 60 && substitute($l.month, 1) ||
    days < 365 && substitute($l.months, Math.floor(days / 30)) ||
    years < 2 && substitute($l.year, 1) ||
    substitute($l.years, Math.floor(years));

  return [prefix, words, suffix].join(" ").toString().trim();
};

function parse (iso8601) {
  if (!iso8601) return;
  var s = iso8601.trim();
  s = s.replace(/\.\d\d\d+/,""); // remove milliseconds
  s = s.replace(/-/,"/").replace(/-/,"/");
  s = s.replace(/T/," ").replace(/Z/," UTC");
  s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
  return new Date(s);
}

$l.parse = parse;

function inWords (date) {
  return $l.inWords(distance(date));
}

function distance (date) {
  return (new Date().getTime() - date.getTime());
}

},{}]},{},[1]);
