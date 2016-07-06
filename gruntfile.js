var path = require('path')

module.exports = function (grunt) {
    grunt.initConfig({
        pkgFile: 'package.json',
        clean: ['build'],
        babel: {
            options: {
                sourceMap: false,
                optional: ['runtime']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: './lib',
                    src: ['**/*'],
                    dest: 'build',
                    ext: '.js'
                }]
            }
        },
        mocha_istanbul: {
            coverage: {
                src: ['test/*.js'],
                options: {
                    scriptPath: require.resolve('isparta/bin/isparta'),
                    reporter: 'spec',
                    nodeExec: require.resolve('.bin/babel-node'),
                    mochaOptions: ['--compilers', 'js:babel/register', '--recursive', '-t', '60000'],
                    require: ['should']
                }
            }
        },
        eslint: {
            options: {
                parser: 'babel-eslint'
            },
            target: ['lib/reporter.js']
        },
        contributors: {
            options: {
                commitMessage: 'update contributors'
            }
        },
        bump: {
            options: {
                commitMessage: 'v%VERSION%',
                pushTo: 'upstream'
            }
        },
        watch: {
            dist: {
                files: './lib/**/*.js',
                tasks: ['babel:dist']
            }
        }
    })

    require('load-grunt-tasks')(grunt)
    grunt.registerTask('default', ['eslint', 'build', 'mocha_istanbul'])
    grunt.registerTask('build', 'Build wdio-allure-reporter', function () {
        grunt.task.run([
            'clean',
            'babel'
        ])
    })
    grunt.registerTask('release', 'Bump and tag version', function (type) {
        grunt.task.run([
            'build',
            'contributors',
            'bump:' + (type || 'patch')
        ])
    })
}
