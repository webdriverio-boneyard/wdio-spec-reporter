import sinon from 'sinon'
import chalk from 'chalk'
import SpecReporter from '../lib/reporter'
import {
    SUITE, RESULTLIST, SUMMARY, ERRORS, ERRORLIST,
    STATS, STATS_WITH_NO_SPECS, SUITERESULT, JOBLINKRESULT,
    ERRORS_NO_STACK, ERRORLIST_NO_STACK, SUITES_SUMMARY,
    STATS_WITH_MULTIPLE_RUNNERS
} from './fixtures'

const baseReporter = {
    symbols: {
        ok: '✓',
        err: '✖',
        dot: '․',
        error: 'F'
    }
}
const reporter = new SpecReporter(baseReporter)

/**
 * disable colors for testing purposes
 */
reporter.chalk = new chalk.constructor({level: 0})

describe('spec reporter', () => {
    describe('the runner:start event', () => {
        it('should setup an initial state', () => {
            reporter.emit('runner:start', {
                cid: 42,
                specs: {
                    a: false,
                    b: 1
                }
            })
            reporter.suiteIndents[42].should.be.empty()
            reporter.indents[42].should.equal(0)
            reporter.specs[42].should.eql({
                a: false,
                b: 1
            })
            reporter.results[42].should.eql({
                passing: 0,
                pending: 0,
                failing: 0
            })
        })
    })

    describe('the runner:end event', () => {
        it('should print results', done => {
            const origPrintSuiteResult = reporter.printSuiteResult
            reporter.printSuiteResult = () => done()
            reporter.emit('runner:end', {
                cid: 42
            })

            reporter.printSuiteResult = origPrintSuiteResult
        })
    })

    describe('the suite:start event', () => {
        it('should increase indent', () => {
            reporter.emit('suite:start', {
                cid: 42,
                uid: '123'
            })
            reporter.suiteIndents[42][123].should.equal(1)
            reporter.indents[42].should.equal(1)
        })
    })

    describe('the suite:end event', () => {
        it('should decrease indent', () => {
            reporter.emit('suite:end', {
                cid: 42
            })
            reporter.indents[42].should.equal(0)
        })
    })

    describe('the test:pending event', () => {
        it('should increase pending tests', () => {
            reporter.emit('test:pending', {
                cid: 42
            })
            reporter.results[42].pending.should.equal(1)
        })
    })

    describe('the test:pass event', () => {
        it('should increase passing tests', () => {
            reporter.emit('test:pass', {
                cid: 42
            })
            reporter.results[42].passing.should.equal(1)
        })
    })

    describe('the test:fail event', () => {
        it('should increase failing tests', () => {
            reporter.emit('test:fail', {
                cid: 42
            })
            reporter.results[42].failing.should.equal(1)
        })
    })

    describe('the end event', () => {
        it('should print summary', done => {
            const origPrintSuitesSummary = reporter.printSuitesSummary
            reporter.printSuitesSummary = () => done()
            reporter.emit('end')

            reporter.printSuitesSummary = origPrintSuitesSummary
        })
    })

    describe('indent', () => {
        it('should return nothing if indent is 1', () => {
            reporter.suiteIndents[0] = {
                'some spec title': 1
            }
            reporter.indent(0, 'some spec title').should.be.equal('')
        })

        it('should return correct indent', () => {
            reporter.suiteIndents[0] = {
                'some spec title': 3
            }
            reporter.indent(0, 'some spec title').should.be.equal('        ')
        })
    })

    describe('getSymbol', () => {
        it('should return the right symbol', () => {
            reporter.getSymbol('pass').should.be.equal('✓')
            reporter.getSymbol('pending').should.be.equal('-')

            reporter.errorCount = 23
            reporter.getSymbol('fail').should.be.equal('24)')
        })
    })

    describe('getColor', () => {
        it('should return the right symbol', () => {
            reporter.getColor('pass').should.be.equal('green')
            reporter.getColor('passing').should.be.equal('green')
            reporter.getColor('pending').should.be.equal('cyan')
            reporter.getColor('fail').should.be.equal('red')
            reporter.getColor('fail').should.be.equal('red')
            reporter.getColor('failing').should.be.equal('red');
            (reporter.getColor('foobar') === null).should.be.true()
        })
    })

    describe('getBrowserCombo', () => {
        it('should return verbose desktop combo', () => {
            reporter.getBrowserCombo({
                browserName: 'chrome',
                version: 50,
                platform: 'Windows 8.1'
            }).should.be.equal('chrome (v50) on Windows 8.1')
        })

        it('should return preface desktop combo', () => {
            reporter.getBrowserCombo({
                browserName: 'chrome',
                version: 50,
                platform: 'Windows 8.1'
            }, false).should.be.equal('chrome 50 Windows 8.1')
        })

        it('should return verbose mobile combo', () => {
            reporter.getBrowserCombo({
                deviceName: 'iPhone 6 Plus',
                platformVersion: '9.2',
                platformName: 'iOS'
            }).should.be.equal('iPhone 6 Plus on iOS 9.2')
        })

        it('should return preface mobile combo', () => {
            reporter.getBrowserCombo({
                deviceName: 'iPhone 6 Plus',
                platformVersion: '9.2',
                platformName: 'iOS'
            }, false).should.be.equal('iPhone 6 Plus iOS 9.2')
        })

        it('should return verbose mobile combo executing an app', () => {
            reporter.getBrowserCombo({
                deviceName: 'iPhone 6 Plus',
                platformVersion: '9.2',
                platformName: 'iOS',
                app: 'sauce-storage:myApp.app'
            }).should.be.equal('iPhone 6 Plus on iOS 9.2 executing myApp.app')
        })

        it('should return preface mobile combo executing an app', () => {
            reporter.getBrowserCombo({
                deviceName: 'iPhone 6 Plus',
                platformVersion: '9.2',
                platformName: 'iOS',
                app: 'sauce-storage:myApp.app'
            }).should.be.equal('iPhone 6 Plus on iOS 9.2 executing myApp.app')
        }, false)

        it('should return verbose mobile combo executing a browser', () => {
            reporter.getBrowserCombo({
                deviceName: 'iPhone 6 Plus',
                platformVersion: '9.2',
                platformName: 'iOS',
                browserName: 'Safari'
            }).should.be.equal('iPhone 6 Plus on iOS 9.2 executing Safari')
        })

        it('should return preface mobile combo executing a browser', () => {
            reporter.getBrowserCombo({
                deviceName: 'iPhone 6 Plus',
                platformVersion: '9.2',
                platformName: 'iOS',
                browserName: 'Safari'
            }, false).should.be.equal('iPhone 6 Plus iOS 9.2')
        })

        it('should return verbose desktop combo when using BrowserStack capabilities', () => {
            reporter.getBrowserCombo({
                browser: 'Chrome',
                browser_version: 50,
                os: 'Windows',
                os_version: '10'
            }).should.be.equal('Chrome (v50) on Windows 10')
        })

        it('should return preface desktop combo when using BrowserStack capabilities', () => {
            reporter.getBrowserCombo({
                browser: 'Chrome',
                browser_version: 50,
                os: 'Windows',
                os_version: '10'
            }, false).should.be.equal('Chrome 50 Windows 10')
        })
    })

    describe('getResultList', () => {
        it('return a correct result list', () => {
            reporter.errorCount = 27
            reporter.suiteIndents[0] = {
                'some foobar test': 0,
                'some other foobar test': 1,
                'some spec title': 0
            }
            reporter.getResultList(0, SUITE, 'kuckkuck> ').should.be.equal(RESULTLIST)
        })
    })

    describe('getSummary', () => {
        it('should return correct summary', () => {
            reporter.getSummary({
                passing: 3,
                pending: 1,
                failing: 2
            }, 139000, 'kuckkuck> ').should.be.equal(SUMMARY)
        })

        it('should skip if the count is zero', () => {
            reporter.getSummary({
                passing: 0
            }, 139000, 'kuckkuck> ').should.be.equal('')
        })
    })

    describe('getFailureList', () => {
        it('should return correct failure list', () => {
            reporter.getFailureList(ERRORS, 'kuckkuck> ').should.be.equal(ERRORLIST)
        })

        it('should handle error messages without a stack trace correctly', () => {
            reporter.getFailureList(ERRORS_NO_STACK, 'kuckkuck> ').should.be.equal(ERRORLIST_NO_STACK)
        })
    })

    describe('getJobLink', () => {
        it('should return nothing if host is not specified', () => {
            reporter.getJobLink({ config: {} }).should.be.equal('')
        })

        it('should return nothing if host is not known', () => {
            reporter.getJobLink({ config: { host: 'localhost' } }).should.be.equal('')
        })

        it('should display job link if host is saucelabs', () => {
            reporter.getJobLink({
                config: { host: 'ondemand.saucelabs.com' },
                sessionID: '12345-12345-12345'
            }, 'kuckkuck> ').should.be.equal(JOBLINKRESULT)
        })
    })

    describe('printSuiteResult', () => {
        let origConsoleLog

        before(() => {
            origConsoleLog = console.log
        })

        beforeEach(() => {
            console.log = sinon.spy()
        })

        afterEach(() => {
            console.log = origConsoleLog
        })

        it('should print correct suite result', () => {
            reporter.specs = { '22': '/path/to/spec.js' }
            reporter.baseReporter.stats = STATS
            reporter.getResultList = () => ''
            reporter.getSummary = () => ''
            reporter.getFailureList = () => ''
            reporter.getJobLink = () => ''

            reporter.printSuiteResult({ cid: 22 })
            const wasCalledCorrectly = console.log.calledWith(SUITERESULT)

            wasCalledCorrectly.should.be.ok()
        })

        it('should not print anything if no spec got executed', () => {
            reporter.specs = { '22': '/path/to/spec.js' }
            reporter.baseReporter.stats = STATS_WITH_NO_SPECS
            reporter.getResultList = () => ''
            reporter.getSummary = () => ''
            reporter.getFailureList = () => ''
            reporter.getJobLink = () => ''

            reporter.printSuiteResult({ cid: 22 })
            const wasCalledCorrectly = console.log.calledWith('')

            wasCalledCorrectly.should.be.ok()
        })
    })

    describe('printSuitesSummary', () => {
        let origConsoleLog

        before(() => {
            origConsoleLog = console.log
        })

        beforeEach(() => {
            console.log = sinon.spy()
        })

        afterEach(() => {
            console.log = origConsoleLog
        })

        it('should print summary of how many specs where run', () => {
            reporter.baseReporter.stats = STATS_WITH_MULTIPLE_RUNNERS
            reporter.baseReporter.epilogue = () => console.log('foobar')

            reporter.printSuitesSummary()
            const wasCalledCorrectly = console.log.calledWith(SUITES_SUMMARY)

            wasCalledCorrectly.should.be.ok()
        })

        it('should not print summary if only one spec was run', () => {
            reporter.baseReporter.stats = STATS
            reporter.baseReporter.epilogue = () => console.log('foobar')

            reporter.printSuitesSummary()
            const callCount = console.log.callCount

            callCount.should.be.equal(0)
        })
    })
})
