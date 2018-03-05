import events from 'events'
import chalk from 'chalk'
import humanizeDuration from 'humanize-duration'

const DURATION_OPTIONS = {
    units: ['m', 's'],
    round: true,
    spacer: ''
}

/**
 * Initialize a new `spec` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */
class SpecReporter extends events.EventEmitter {
    constructor (baseReporter, config, options = {}) {
        super()

        this.chalk = chalk
        this.baseReporter = baseReporter
        this.config = config
        this.options = options
        this.shortEnglishHumanizer = humanizeDuration.humanizer({
            language: 'shortEn',
            languages: { shortEn: {
                h: () => 'h',
                m: () => 'm',
                s: () => 's',
                ms: () => 'ms'
            }}
        })

        this.errorCount = 0
        this.indents = {}
        this.suiteIndents = {}
        this.specs = {}
        this.results = {}

        this.on('runner:start', function (runner) {
            this.suiteIndents[runner.cid] = {}
            this.indents[runner.cid] = 0
            this.specs[runner.cid] = runner.specs
            this.results[runner.cid] = {
                passing: 0,
                pending: 0,
                failing: 0
            }
        })

        this.on('suite:start', function (suite) {
            this.suiteIndents[suite.cid][suite.uid] = ++this.indents[suite.cid]
        })

        this.on('test:pending', function (test) {
            this.results[test.cid].pending++
        })

        this.on('test:pass', function (test) {
            this.results[test.cid].passing++
        })

        this.on('test:fail', function (test) {
            this.results[test.cid].failing++
        })

        this.on('suite:end', function (suite) {
            this.indents[suite.cid]--
        })

        this.on('runner:end', function (runner) {
            this.printSuiteResult(runner)
        })

        this.on('end', function () {
            this.printSuitesSummary()
        })
    }

    indent (cid, uid) {
        const indents = this.suiteIndents[cid][uid]
        return indents === 0 ? '' : Array(indents).join('    ')
    }

    getSymbol (state) {
        const { symbols } = this.baseReporter
        let symbol = '?' // in case of an unknown state

        switch (state) {
        case 'pass':
            symbol = symbols.ok
            break
        case 'pending':
            symbol = '-'
            break
        case 'fail':
            this.errorCount++
            symbol = this.errorCount + ')'
            break
        }

        return symbol
    }

    getColor (state) {
        let color = null // in case of an unknown state

        switch (state) {
        case 'pass':
        case 'passing':
            color = 'green'
            break
        case 'pending':
            color = 'cyan'
            break
        case 'fail':
        case 'failing':
            color = 'red'
            break
        }

        return color
    }

    getBrowserCombo (caps, verbose = true) {
        const device = caps.deviceName
        const browser = caps.browserName || caps.browser
        const version = caps.version || caps.platformVersion || caps.browser_version
        const platform = caps.os ? (caps.os + ' ' + caps.os_version) : (caps.platform || caps.platformName)

        /**
         * mobile capabilities
         */
        if (device) {
            const program = (caps.app || '').replace('sauce-storage:', '') || caps.browserName
            const executing = program ? `executing ${program}` : ''

            if (!verbose) {
                return `${device} ${platform} ${version}`
            }

            return `${device} on ${platform} ${version} ${executing}`.trim()
        }

        if (!verbose) {
            return (browser + ' ' + (version || '') + ' ' + (platform || '')).trim()
        }

        return browser + (version ? ` (v${version})` : '') + (platform ? ` on ${platform}` : '')
    }

    getResultList (cid, suites, preface = '') {
        let output = ''

        for (const specUid in suites) {
            // Remove "before all" tests from the displayed results
            if (specUid.indexOf('"before all"') === 0) {
                continue
            }

            const spec = suites[specUid]
            const indent = this.indent(cid, specUid)
            const specTitle = suites[specUid].title

            if (specUid.indexOf('"before all"') !== 0) {
                output += `${preface} ${indent}${specTitle}\n`
            }

            for (const testUid in spec.tests) {
                const test = spec.tests[testUid]
                const testTitle = spec.tests[testUid].title

                if (test.state === '') {
                    continue
                }

                output += preface
                output += '   ' + indent
                output += this.chalk[this.getColor(test.state)](this.getSymbol(test.state))
                output += ' ' + testTitle + '\n'
            }

            output += preface.trim() + '\n'
        }

        return output
    }

    getSummary (states, duration, preface = '') {
        let output = ''
        let displayedDuration = false

        for (const state in states) {
            const testCount = states[state]
            let testDuration = ''

            /**
             * don't display 0 passing/pending of failing test label
             */
            if (testCount === 0) {
                continue
            }

            /**
             * set duration
             */
            if (!displayedDuration) {
                testDuration = ' (' + this.shortEnglishHumanizer(duration, DURATION_OPTIONS) + ')'
            }

            output += preface + ' '
            output += this.chalk[this.getColor(state)](testCount)
            output += ' ' + this.chalk[this.getColor(state)](state)
            output += testDuration
            output += '\n'
            displayedDuration = true
        }

        return output
    }

    getFailureList (failures, preface) {
        let output = ''

        failures.forEach((test, i) => {
            const title = typeof test.parent !== 'undefined' ? test.parent + ' ' + test.title : test.title
            output += `${preface.trim()}\n`
            output += `${preface} ${(i + 1)}) ${title}:\n`
            output += `${preface} ${this.chalk.red(test.err.message)}\n`
            if (test.err.stack) {
                const stack = test.err.stack.split(/\n/g).map((l) => `${preface} ${this.chalk.gray(l)}`).join('\n')
                output += `${stack}\n`
            } else {
                output += `${preface} ${this.chalk.gray('no stack available')}\n`
            }
        })

        return output
    }

    getJobLink (results, preface) {
        if (!results.config.host) {
            return ''
        }

        let output = ''
        if (results.config.host.indexOf('saucelabs.com') > -1 || results.config.sauceConnect === true) {
            output += `${preface.trim()}\n`
            output += `${preface} Check out job at https://saucelabs.com/tests/${results.sessionID}\n`
            return output
        }

        return output
    }

    getSuiteResult (runner) {
        const cid = runner.cid
        const stats = this.baseReporter.stats
        const results = stats.runners[cid]
        const preface = `[${this.getBrowserCombo(results.capabilities, false)} #${cid}]`
        const specHash = stats.getSpecHash(runner)
        const spec = results.specs[specHash]
        const combo = this.getBrowserCombo(results.capabilities)
        const failures = stats.getFailures().filter((f) => f.cid === cid || Object.keys(f.runner).indexOf(cid) > -1)

        /**
         * don't print anything if no specs where executed
         */
        if (Object.keys(spec.suites).length === 0) {
            return ''
        }

        this.errorCount = 0
        let output = ''

        output += '------------------------------------------------------------------\n'

        /**
         * won't be available when running multiremote tests
         */
        if (results.sessionID) {
            output += `${preface} Session ID: ${results.sessionID}\n`
        }

        output += `${preface} Spec: ${this.specs[cid]}\n`

        /**
         * won't be available when running multiremote tests
         */
        if (combo) {
            output += `${preface} Running: ${combo}\n`
        }

        output += `${preface}\n`
        output += this.getResultList(cid, spec.suites, preface)
        output += `${preface}\n`
        output += this.getSummary(this.results[cid], spec._duration, preface)
        output += this.getFailureList(failures, preface)
        output += this.getJobLink(results, preface)
        output += `${preface}\n`
        return output
    }

    printSuiteResult (runner) {
        console.log(this.getSuiteResult(runner))
    }

    getSuitesSummary (specCount) {
        let output = '\n\n==================================================================\n'
        output += 'Number of specs: ' + specCount
        return output
    }

    printSuitesSummary () {
        const specCount = Object.keys(this.baseReporter.stats.runners).length

        /**
         * no need to print summary if only one runner was executed
         */
        if (specCount === 1) {
            return
        }

        const epilogue = this.baseReporter.epilogue
        console.log(this.getSuitesSummary(specCount))
        epilogue.call(this.baseReporter)
    }
}

export default SpecReporter
