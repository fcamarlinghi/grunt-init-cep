/**
 * Copyright {%= year %} {%= author_name %}
 * All rights reserved.
 */

'use strict';

module.exports = function (grunt)
{
    grunt.initConfig({
        // Extension debug and packaging
        cep: {
            options: require('./bundle/cep-config.js'),

            debug: {
                options: {
                    profile: 'launch',
                },
            },

            release: {
                options: {
                    profile: 'package',
                },
            },
        },
    });

    // Load grunt-cep tasks
    grunt.loadNpmTasks('grunt-cep');
};
