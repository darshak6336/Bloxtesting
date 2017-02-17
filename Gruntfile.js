

module.exports = function (grunt) {
    'use strict';

  // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',

            ],

        },
        // Before generating any new files, remove any previously-created files.

        cordovacli: {
            options: {
                path: __dirname,
                cli: 'cordova'    //cordova or cca
            },
            cordova: {
                options: {
                    command: ['platform','plugin','build'],
                    platforms: ['ios','android'],
                    plugins: ['device','dialogs'],
                    path: 'cordova',

                }
            },

            // create: {
            //     options: {
            //         command: 'create',
            //         id: 'com.myHybridApp', //optional
            //         name: 'myHybridApp'    //optional
            //     }
            // },
            add_platforms: {
                options: {
                    command: 'platform',
                    action: 'add',                  //valid actions for command platform are add , remove, rm
                    platforms: ['ios', 'android']          //valid platforms for command platform are ios, android, blackberry10, wp8, wp7
                }
            },
            add_platforms_android: {
                options: {
                    command: 'platform',
                    action: 'add',                  //valid actions for command platform are add , remove, rm
                    platforms: ['android']          //valid platforms for command platform are ios, android, blackberry10, wp8, wp7
                }
            },
            add_platforms_ios: {
                options: {
                    command: 'platform',
                    action: 'add',                  //valid actions for command platform are add , remove, rm
                    platforms: ['ios']          //valid platforms for command platform are ios, android, blackberry10, wp8, wp7
                }
            },
            add_platforms_ios_folder: {
                options: {
                    command: 'platform',
                    action: 'add',                  //valid actions for command platform are add , remove, rm
                    platforms: ['../node_modules/cordova-ios']          //valid platforms for command platform are ios, android, blackberry10, wp8, or folder
                }
            },
            add_plugins: {
                options: {
                    command: 'plugin',
                    action: 'add',                  //valid actions for command plugin are add , remove, rm
                    plugins: [                      //plugins are fetched from NPM
                      'camera',
                      'compat',
                      'console',
                      'device',
                      'inappbrowser',
                      'network-information',
                      'diagnostic',
                      'crosswalk-webview',
                      'fcm',
                      'file-opener2',
                      'filepath',
                      'statusbar',
                      'whitelis',
                      'keyboard',
                      'file',
                      'file-transfer',
                      'inappbrowserxwalk',
                      'FilePicker',
                      'filechooser',
                      'intent'
                    ]
                }
            },
            add_plugins_test: {
                options: {
                    command: 'plugin',
                    action: 'add',                  //valid actions for command plugin are add , remove, rm
                    plugins: [                      //plugins are fetched from NPM
                        'battery-status',
                        'node_modules/cordova-plugin-camera',
                        'org.apache.cordova.camera'

                    ]
                }
            },
            add_plugins_id: {
                options: {
                    command: 'plugin',
                    action: 'add',                  //valid actions for command plugin are add , remove, rm
                    plugins: [                      //plugins are fetched from NPM
                        'battery-status'
                    ]
                }
            },
            remove_plugin_id: {
                options: {
                    command: 'plugin',
                    action: 'rm',                  //valid actions for command plugin are add , remove, rm
                    plugins: [                      //plugins are remove only by shortcut or id example 'battery-status' or com.apache.cordova.baterry-status
                        'battery-status'
                    ]
                }
            },
            build: {
                options: {
                    command: 'build',
                    platforms: ['ios', 'android']
                }
            },
            emulate_android: {
                options: {
                    command: 'emulate',
                    platforms: ['android']
                }
            },
            build_android_release: {
                options: {
                    command: 'build',
                    platforms: ['android'],
                    args: ['--release']
                }
            },
            add_facebook_plugin: {
                options: {
                    command: 'plugin',
                    action: 'add',
                    plugins: [
                        'com.phonegap.plugins.facebookconnect'
                    ],
                    args:['--variable','APP_ID=fb12132424','--variable','APP_NAME=myappname']
                }
            }
        },

        // Unit tests.


    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('default', [/*'cordovacli:add_plugins', */ 'cordovacli:add_platforms']);


    // By default, lint and run all tests.
    //grunt.registerTask('default', ['jshint', 'test']);

};
