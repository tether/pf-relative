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
  };

  return directive;
})

.provider('RelativeDate', function pfRelative () {
  this.$get = function () { return RelativeDate; };
  this.options = require('./options');
  this.one = require('./one');
  this.ms = require('milliseconds');
});
