/*jslint node: true */
/*global */

module.exports = function (grunt) {
    "use strict";

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jslint: { // configure the task
            client: {
                src: [
                    'src/*.js'
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
                separator: ';'
            },
            dist: {
                src: ['src/*.js'],
                dest: '<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/* <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                sourceMap: '<%= pkg.name %>-<%= pkg.version %>.min.map'
            },
            dist: {
                files: {
                    '<%= pkg.name %>-<%= pkg.version %>.min.js': ['<%= concat.dist.dest %>']
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

    // Default task(s)
    grunt.registerTask('default', ['jslint', 'concat', 'uglify', 'shell']);
};
