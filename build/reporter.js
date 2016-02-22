'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

/**
 * Initialize a new `spec` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

var SpecReporter = (function (_events$EventEmitter) {
    _inherits(SpecReporter, _events$EventEmitter);

    function SpecReporter(baseReporter, config) {
        var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        _classCallCheck(this, SpecReporter);

        _get(Object.getPrototypeOf(SpecReporter.prototype), 'constructor', this).call(this);

        this.baseReporter = baseReporter;
        this.config = config;
        this.options = options;

        var epilogue = this.baseReporter.epilogue;

        this.testsBy = {};
        this.indents = 0;
        this.errorCount = 0;

        this.on('start', function () {
            console.log();
        });
        /**
         * remember which tests got executed by runner
         */
        this.on('runner:start', function (runner) {
            this.testsBy[runner.pid] = [];
        });

        this.on('suite:start', function (suite) {
            /**
             * mark state for runner as "reached"
             */
            this.testsBy[suite.pid].push(true);
            /**
             * only continue if all runner have reached that state
             * otherwise show spinner ascii gimmick
             */
            if (!this.gotExecutedByAllRunner(suite.pid)) {
                return this.runSpinner(suite, 'suite');
            }

            ++this.indents;
            this.clearSpinner();
            console.log(this.baseReporter.color('suite', '%s%s'), this.indent(), suite.title);
        });

        this.on('suite:end', function (suite) {
            /**
             * mark state for runner as "reached"
             */
            this.testsBy[suite.pid].push(true);
            /**
             * only continue if all runner have reached that state
             */
            if (!this.gotExecutedByAllRunner(suite.pid)) {
                return;
            }

            --this.indents;
            if (this.indents === 1) {
                console.log();
            }
        });

        this.on('test:start', function (test) {
            if (this.spinner) {
                return;
            }
            this.runSpinner(test, 'pass');
        });

        this.on('test:pending', function (test) {
            /**
             * mark state for runner as "reached"
             */
            this.testsBy[test.pid].push(true);
            /**
             * only continue if all runner have reached that state
             * otherwise show spinner ascii gimmick
             */
            if (!this.gotExecutedByAllRunner(test.pid)) {
                return;
            }
            var fmt = this.indent() + this.baseReporter.color('pending', '  - %s');
            this.clearSpinner();
            this.baseReporter.cursor.CR();
            console.log(fmt, test.title);
        });

        this.on('test:pass', function (test) {
            var stats = this.baseReporter.stats.getTestStats(test);

            /**
             * mark state for runner as "reached"
             */
            this.testsBy[test.pid].push(true);
            /**
             * only continue if all runner have reached that state
             */
            if (!this.gotExecutedByAllRunner(test.pid)) {
                return;
            }

            var fmt = this.indent() + this.baseReporter.color('checkmark', '  ' + this.baseReporter.symbols.ok) + this.baseReporter.color('pass', ' %s') + this.baseReporter.color('medium', ' (%dms)');
            this.clearSpinner();
            this.baseReporter.cursor.CR();
            console.log(fmt, test.title, stats.duration);
        });

        this.on('test:fail', function (test) {
            /**
             * mark state for runner as "reached"
             */
            this.testsBy[test.pid].push(true);
            /**
             * only continue if all runner have reached that state
             */
            if (!this.gotExecutedByAllRunner(test.pid)) {
                return;
            }

            this.clearSpinner();
            this.baseReporter.cursor.CR();
            console.log(this.indent() + this.baseReporter.color('fail', '  %d) %s'), ++this.errorCount, test.title);
        });

        this.on('end', function () {
            this.clearSpinner();
            epilogue.call(baseReporter);
            console.log();
        });
    }

    /**
     * returns true if test got executed by all runner
     */

    _createClass(SpecReporter, [{
        key: 'gotExecutedByAllRunner',
        value: function gotExecutedByAllRunner(pid) {
            /**
             * always true when there is only one runner
             */
            if (_Object$keys(this.testsBy).length === 1) {
                return true;
            }

            var pos = this.testsBy[pid].length - 1;
            return this.gotExecutedBy(pos) === _Object$keys(this.stats.runner).length;
        }

        /**
         * returns number of how many runners have executed the test
         */
    }, {
        key: 'gotExecutedBy',
        value: function gotExecutedBy(pos) {
            var self = this;
            var gotExecutedBy = 0;
            _Object$keys(this.testsBy).forEach(function (pid) {
                /**
                 * only increase variable if runner has executed the tes
                 */
                !!self.testsBy[pid][pos] && gotExecutedBy++;
            });
            return gotExecutedBy;
        }
    }, {
        key: 'indent',
        value: function indent() {
            return this.indents < 0 ? '' : Array(this.indents).join('  ');
        }

        /**
         * starts little ascii spinner gimick
         */
    }, {
        key: 'runSpinner',
        value: function runSpinner(test, color) {
            var spinStates = ['◴', '◷', '◶', '◵'];
            var testsBy = this.testsBy;
            var inSpinState = 0;

            /**
             * no need for a spinner if one is already spinning or if we only have one runner
             */
            if (this.spinner || _Object$keys(this.testsBy).length === 1) {
                return;
            }

            /**
             * no fancy spinner without tty
             */
            if (!this.baseReporter.cursor.isatty) {
                this.spinner = true;
                return;
            }

            this.spinner = setInterval((function () {
                this.baseReporter.cursor.beginningOfLine();
                /**
                 * no special spinner for suite label
                 */
                if (color === 'suite') {
                    return process.stdout.write(this.baseReporter.color(color, test.title));
                }

                /**
                 * get position of slowest runner
                 */
                var pos = null;
                _Object$keys(testsBy).forEach(function (pid) {
                    if (pos === null) {
                        pos = testsBy[pid].length;
                    }
                    pos = Math.min(pos, testsBy[pid].length);
                });
                /**
                 * need util.print here as it prints with right encoding
                 */
                process.stdout.write('  ' + this.baseReporter.color('medium', spinStates[inSpinState % 4]) + ' ' + this.baseReporter.color(color, test.title));
                process.stdout.write(this.baseReporter.color('medium', ' (' + this.gotExecutedBy(pos) + '/' + _Object$keys(this.stats.runner).length) + ')');
                inSpinState++;
            }).bind(this), 100);
        }

        /**
         * remove and clear spinner
         */
    }, {
        key: 'clearSpinner',
        value: function clearSpinner() {
            clearInterval(this.spinner);
            delete this.spinner;
            this.baseReporter.cursor.deleteLine();
            this.baseReporter.cursor.beginningOfLine();
        }
    }]);

    return SpecReporter;
})(_events2['default'].EventEmitter);

exports['default'] = SpecReporter;
module.exports = exports['default'];
