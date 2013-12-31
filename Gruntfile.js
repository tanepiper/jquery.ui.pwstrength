/*jslint node: true */
/*global */

module.exports = function (grunt) {
    "use strict";

    var license =
        '/*!\n' +
        '* jQuery Password Strength plugin for Twitter Bootstrap\n' +
        '*\n' +
        '* Copyright (c) 2008-2013 Tane Piper\n' +
        '* Copyright (c) 2013 Alejandro Blanco\n' +
        '* Dual licensed under the MIT and GPL licenses.\n' +
        '*/\n\n' +
        '(function (jQuery) {\n';

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jslint: { // configure the task
            client: {
                src: [
                    'src/*js', 'spec/*js', 'Gruntfile.js'
                ],
                directives: {
                    browser: true,
                    predef: [
                        'jQuery'
                    ]
                }
            }
        },
        concat: {
            options: {
                banner: license,
                footer: '}(jQuery));',
                process: function (src, filepath) {
                    // Remove ALL block comments, the stripBanners only removes
                    // the first one
                    src = src.replace(/\/\*[\s\S]*?\*\//g, '');
                    return '// Source: ' + filepath + src;
                }
            },
            dist: {
                src: [
                    'src/rules.js', 'src/options.js', 'src/ui.js',
                    'src/methods.js'
                ],
                dest: '<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> - GPLv3 & MIT License */\n',
                sourceMap: '<%= pkg.name %>-<%= pkg.version %>.min.map'
            },
            dist: {
                files: {
                    '<%= pkg.name %>-<%= pkg.version %>.min.js': [
                        '<%= concat.dist.dest %>'
                    ]
                }
            }
        },
        shell: {
            copyFile: {
                command: 'cp <%= concat.dist.dest %> examples/pwstrength.js'
            },
            makeDir: {
                command: 'mkdir -p dist'
            },
            moveFiles: {
                command: 'mv <%= pkg.name %>-<%= pkg.version %>* dist/'
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jasmine-node');

    grunt.registerTask('test', ['jslint', 'jasmine_node']);

    // Default task(s)
    grunt.registerTask('default', ['jslint', 'concat', 'uglify', 'shell']);
};
