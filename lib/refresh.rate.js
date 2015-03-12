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
