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
kuckkuck>    \u001b[32m✓\u001b[39m foo
kuckkuck>    \u001b[36m-\u001b[39m bar
kuckkuck>
kuckkuck>  some other foobar test
kuckkuck>    \u001b[32m✓\u001b[39m that is a test
kuckkuck>    \u001b[31m28)\u001b[39m and another test
kuckkuck>
kuckkuck>  some spec title
kuckkuck>    \u001b[31m29)\u001b[39m some last test
kuckkuck>    \u001b[31m30)\u001b[39m really last
kuckkuck>
`

export const SUMMARY = `kuckkuck>  \u001b[32m3\u001b[39m \u001b[32mpassing\u001b[39m (2m, 19s)
kuckkuck>  \u001b[36m1\u001b[39m \u001b[36mpending\u001b[39m
kuckkuck>  \u001b[31m2\u001b[39m \u001b[31mfailing\u001b[39m
`

export const ERRORLIST = `kuckkuck>
kuckkuck>  1) some parent some title:
kuckkuck>  \u001b[31mOoops\u001b[39m
kuckkuck>  \u001b[90mHi\u001b[39m
kuckkuck>  \u001b[90mwhat up\u001b[39m
kuckkuck>  \u001b[90mthere?\u001b[39m
kuckkuck>
kuckkuck>  2) some other title:
kuckkuck>  \u001b[31moh shit\u001b[39m
kuckkuck>  \u001b[90msomething\u001b[39m
kuckkuck>  \u001b[90mwent\u001b[39m
kuckkuck>  \u001b[90mwrong\u001b[39m
`

export const ERRORLIST_NO_STACK = `kuckkuck>
kuckkuck>  1) some parent some title:
kuckkuck>  \u001b[31mOoops\u001b[39m
kuckkuck>  \u001b[90mno stack available\u001b[39m
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
