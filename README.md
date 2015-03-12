# PetroFeed Relative
An [AngularJS](https://angularjs.org/) directive that provides a live relative date (time ago) with cut-off support.

## Installation

```
bower install pf-relative
```

## Usage

```javascript
angular.module('MyModule', ['pf-relative']);
```

```html
<time pf-relative="model.createdAt">…</time>
```

## Options

This is how you can set your options (the example uses the default values):

```javascript
angular.module('MyModule', ['pf-relative'])
.config(function (RelativeDateProvider) {

  var one = RelativeDateProvider.one;

  RelativeDateProvider.options.extend({
    cutoff       : Infinity, // in milliseconds
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
  });

});
```

So, the `RelativeDateProvider` object exposes the following:

  * `RelativeDateProvider.options`: where you can read the defined options or call `.extend` to override the existing ones.
  * `RelativeDateProvider.one`: A convenience object that provides milliseconds of anything.
  * `RelativeDateProvider.ms`: The [milliseconds](https://github.com/henrikjoreteg/milliseconds) module. It can be used when setting `{ cutoff: ms.days(5) }` for example.

## Acknowledgements

* [strftime](https://github.com/samsonjs/strftime): To provide the `cutoffFormat` functionality, so please refer to it when defining how your dates should be formatted when they make the cut-off threshold.
* [timeago](https://github.com/ecto/node-timeago): Converts a date into a relative, human readable, sentence.

# License [![Creative Commons License](http://i.creativecommons.org/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)
Creative Commons Attribution 4.0 International

---

Proudly brought to you by [PetroFeed](http://PetroFeed.com).

![Pedro](https://www.petrofeed.com/img/company/pedro.png)
