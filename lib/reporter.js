import events from 'events'

/**
 * Initialize a new `spec` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */
class SpecReporter extends events.EventEmitter {
    constructor (baseReporter, config, options = {}) {
        super()

        this.baseReporter = baseReporter
        this.config = config
        this.options = options

        const { epilogue } = this.baseReporter

        this.testsBy = {}
        this.indents = 0

        /**
         * remember which tests got executed by runner
         */
        this.on('runner:start', function (runner) {
            this.testsBy[runner.cid] = []
        })

        this.on('suite:start', function (suite) {
            /**
             * mark state for runner as "reached"
             */
            this.testsBy[suite.cid].push(suite)

            ++this.indents
            console.log(this.baseReporter.color('suite', '%s%s'), this.indent(), suite.title)
        })

        this.on('suite:end', function (suite) {
            /**
             * mark state for runner as "reached"
             */
            this.testsBy[suite.cid].push(true)

            --this.indents
            if (this.indents === 1) {
                console.log()
            }
        })

        this.on('test:start', function (test) {

        })

        this.on('test:pending', function (test) {
            /**
             * mark state for runner as "reached"
             */
            this.testsBy[test.cid].push(true)
            /**
             * only continue if all runner have reached that state
             * otherwise show spinner ascii gimmick
             */
            if (!this.gotExecutedByAllRunner(test.cid)) {
                return
            }
            var fmt = this.indent() + this.baseReporter.color('pending', '  - %s')
            this.clearSpinner()
            this.baseReporter.cursor.CR()
            console.log(fmt, test.title)
        })

        this.on('test:pass', function (test) {
            var stats = this.baseReporter.stats.getTestStats(test)

            /**
             * mark state for runner as "reached"
             */
            this.testsBy[test.cid].push(true)
            /**
             * only continue if all runner have reached that state
             */
            if (!this.gotExecutedByAllRunner(test.cid)) {
                return
            }

            var fmt = this.indent() +
                      this.baseReporter.color('checkmark', '  ' + this.baseReporter.symbols.ok) +
                      this.baseReporter.color('pass', ' %s') +
                      this.baseReporter.color('medium', ' (%dms)')
            this.clearSpinner()
            this.baseReporter.cursor.CR()
            console.log(fmt, test.title, stats.duration)
        })

        this.on('test:fail', function (test) {
            /**
             * mark state for runner as "reached"
             */
            this.testsBy[test.cid].push(true)
            /**
             * only continue if all runner have reached that state
             */
            if (!this.gotExecutedByAllRunner(test.cid)) {
                return
            }

            this.clearSpinner()
            this.baseReporter.cursor.CR()
            console.log(this.indent() + this.baseReporter.color('fail', '  %d) %s'), ++this.errorCount, test.title)
        })

        this.on('end', function () {
            this.clearSpinner()
            epilogue.call(baseReporter)
            console.log()
        })
    }

    indent () {
        return this.indents < 0 ? '' : Array(this.indents).join('  ')
    }

}

export default SpecReporter
