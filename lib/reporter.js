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

        this.indents = {}
        this.suiteIndents = {}
        this.specs = {}

        this.on('runner:start', function (runner) {
            this.suiteIndents[runner.cid] = {}
            this.indents[runner.cid] = 0
            this.specs[runner.cid] = runner.specs
        })

        this.on('suite:start', function (suite) {
            this.suiteIndents[suite.cid][suite.title] = ++this.indents[suite.cid]
        })

        this.on('suite:end', function (suite) {
            this.indents[suite.cid]--
        })

        this.on('runner:end', function (runner) {
            this.printSuiteResult(runner)
        })

        this.on('end', function () {
            epilogue.call(baseReporter)
            console.log()
        })
    }

    indent (cid, specTitle) {
        const indents = this.suiteIndents[cid][specTitle]
        return indents < 0 ? '' : Array(indents).join('  ')
    }

    getSymbol (test) {
        let symbol = '?' // in case of an unknown state

        switch (test.state) {
        case 'pass':
            symbol = this.baseReporter.symbols.ok
            break
        case 'pending':
            symbol = '-'
            break
        case 'fail':
            symbol = this.baseReporter.symbols.err
            break
        }

        return symbol
    }

    printSuiteResult (runner) {
        const cid = runner.cid
        const results = this.baseReporter.stats.runners[cid]
        const preface = `[${results.sanitizedCapabilities} #${cid}]`
        const specHash = this.baseReporter.stats.getSpecHash(runner)
        let output = ''

        output += '------------------------------------------------------------------\n'
        output += `${preface} Session ID: ${results.sessionID}\n`
        output += `${preface} Spec: ${this.specs[cid]}\n`
        output += `${preface}\n`

        for (const specTitle in results.specs[specHash].suites) {
            const spec = results.specs[specHash].suites[specTitle]
            const indent = this.indent(cid, specTitle)
            output += `${preface} ${indent}${specTitle}\n`

            for (const testTitle in spec.tests) {
                const test = spec.tests[testTitle]

                if (test.state === '') {
                    continue
                }

                output += `${preface} ${(indent)}  ${this.getSymbol(test)} ${testTitle}\n`
            }
        }

        output += `\n`

        console.log(output)
    }
}

export default SpecReporter
