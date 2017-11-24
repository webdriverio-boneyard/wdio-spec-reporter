export const SUITE = {
    '"before all"': {},
    'some foobar test1': {
        uid: 'some foobar test1',
        title: 'some foobar test',
        tests: {
            'foo1': {
                title: 'foo',
                uid: 'foo1',
                state: 'pass'
            },
            'bar2': {
                title: 'bar',
                uid: 'bar2',
                state: 'pending'
            }
        }
    },
    'some other foobar test2': {
        uid: 'some other foobar test2',
        title: 'some other foobar test',
        tests: {
            'that is a test4': {
                uid: 'that is a test4',
                title: 'that is a test',
                state: 'pass'
            },
            'and another test': {
                uid: 'and another test5',
                title: 'and another test',
                state: 'fail'
            },
            'even more tests, but invalid state': {
                uid: 'and another test6',
                title: 'and another different test',
                state: ''
            }
        }
    },
    'some spec title3': {
        uid: 'some spec title3',
        title: 'some spec title',
        tests: {
            'some last test6': {
                uid: 'some last test6',
                title: 'some last test',
                state: 'fail'
            },
            'really last7': {
                uid: 'really last7',
                title: 'really last',
                state: 'fail'
            }
        }
    }
}

export const ERRORS = [{
    parent: 'some parent',
    title: 'some title',
    err: {
        message: 'Ooops',
        stack: 'Hi\nwhat up\nthere?'
    }
}, {
    title: 'some other title',
    err: {
        message: 'oh shit',
        stack: 'something\nwent\nwrong'
    }
}]

export const ERRORS_NO_STACK = [{
    parent: 'some parent',
    title: 'some title',
    err: {
        message: 'Ooops'
    }
}]

export const STATS = {
    runners: {
        '22': {
            capabilities: {
                browserName: 'phantomjs'
            },
            specs: {
                '12345': {
                    suites: SUITE
                }
            },
            sessionID: '12345-12345-12345'
        }
    },
    getSpecHash: () => '12345',
    getFailures: () => []
}

export const STATS_WITH_NO_SPECS = {
    runners: {
        '22': {
            capabilities: {
                browserName: 'phantomjs'
            },
            specs: {
                '12345': {
                    suites: {}
                }
            },
            sessionID: '12345-12345-12345'
        }
    },
    getSpecHash: () => '12345',
    getFailures: () => []
}

export const STATS_WITH_MULTIPLE_RUNNERS = {
    runners: {
        '22': {
            capabilities: {
                browserName: 'phantomjs'
            },
            specs: {
                '12345': {
                    suites: SUITE
                }
            },
            sessionID: '12345-12345-12345'
        },
        '23': {
            capabilities: {
                browserName: 'phantomjs'
            },
            specs: {
                '12345': {
                    suites: SUITE
                }
            },
            sessionID: '12345-12345-12345'
        }
    },
    getSpecHash: () => '12345',
    getFailures: () => []
}

export const RESULTLIST = `kuckkuck>  some foobar test
kuckkuck>    ✓ foo
kuckkuck>    - bar
kuckkuck>
kuckkuck>  some other foobar test
kuckkuck>    ✓ that is a test
kuckkuck>    28) and another test
kuckkuck>
kuckkuck>  some spec title
kuckkuck>    29) some last test
kuckkuck>    30) really last
kuckkuck>
`

export const SUMMARY = `kuckkuck>  3 passing (2m, 19s)
kuckkuck>  1 pending
kuckkuck>  2 failing
`

export const ERRORLIST = `kuckkuck>
kuckkuck>  1) some parent some title:
kuckkuck>  Ooops
kuckkuck>  Hi
kuckkuck>  what up
kuckkuck>  there?
kuckkuck>
kuckkuck>  2) some other title:
kuckkuck>  oh shit
kuckkuck>  something
kuckkuck>  went
kuckkuck>  wrong
`

export const ERRORLIST_NO_STACK = `kuckkuck>
kuckkuck>  1) some parent some title:
kuckkuck>  Ooops
kuckkuck>  no stack available
`

export const SUITERESULT = `------------------------------------------------------------------
[phantomjs #22] Session ID: 12345-12345-12345
[phantomjs #22] Spec: /path/to/spec.js
[phantomjs #22] Running: phantomjs
[phantomjs #22]
[phantomjs #22]
[phantomjs #22]
`

export const JOBLINKRESULT = `kuckkuck>
kuckkuck>  Check out job at https://saucelabs.com/tests/12345-12345-12345
`

export const SUITES_SUMMARY = `

==================================================================
Number of specs: 2`
