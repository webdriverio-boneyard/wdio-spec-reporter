WDIO Spec reporter [![Build Status](https://travis-ci.org/webdriverio/wdio-spec-reporter.svg?branch=master)](https://travis-ci.org/webdriverio/wdio-spec-reporter) [![Code Climate](https://codeclimate.com/github/webdriverio/wdio-spec-reporter/badges/gpa.svg)](https://codeclimate.com/github/webdriverio/wdio-spec-reporter) [![Test Coverage](https://codeclimate.com/github/webdriverio/wdio-spec-reporter/badges/coverage.svg)](https://codeclimate.com/github/webdriverio/wdio-spec-reporter/coverage)
==================

> A WebdriverIO plugin to report in spec style.

![Spec Reporter](http://webdriver.io/images/spec.png "Spec Reporter")

## Installation

The easiest way is to keep `wdio-spec-reporter` as a devDependency in your `package.json`.

```json
{
  "devDependencies": {
    "wdio-spec-reporter": "~0.0.1"
  }
}
```

You can simple do it by:

```bash
npm install wdio-spec-reporter --save-dev
```

Instructions on how to install `WebdriverIO` can be found [here](http://webdriver.io/guide/getstarted/install.html).

## Configuration

Following code shows the default wdio test runner configuration. Just add `'spec'` as reporter
to the array.

```js
// wdio.conf.js
module.exports = {
  // ...
  reporters: ['dot', 'spec'],
  // ...
};
```

----

For more information on WebdriverIO see the [homepage](http://webdriver.io).
