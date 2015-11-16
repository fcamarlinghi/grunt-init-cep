/**
 * Copyright 2014 Francesco Camarlinghi
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// Basic template description.
exports.description = 'Create a Creative Cloud extension project.';

// Template-specific notes to be displayed before question prompts.
exports.notes = '';

// Template-specific notes to be displayed after question prompts.
exports.after = 'Please refer to documentation to start developing the extension.';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function (grunt, init, done)
{
    var path = require('path'),
        supported_products = ['photoshop', 'illustrator', 'indesign', 'flash', 'premiere', 'prelude', 'aftereffects', 'dreamweaver', 'incopy'],
        sanitize_products = function (products, supported)
        {
            products = products.toLowerCase().split(/\s*,+\s*/);
            products = products.reduce(function (reduced, item)
            {
                // Remove empty values, duplicates and check if product is valid
                if (item !== '' && reduced.indexOf(item) < 0 && supported.indexOf(item) > -1)
                    reduced.push(item);

                return reduced;
            }, []);
            return products;
        };

    init.process({}, [
        // Prompt for these values
        init.prompt('name'),
        {
            name: 'id',
            message: 'Project Identifier (unique)',
            validator: /^[a-zA-Z][\.a-zA-Z0-9]*$/,
            warning: 'Can only contain letters, numbers, and periods. Must start with a letter.',
            default: function (value, data, done)
            {
                // Copied from grunt-init 'Project name'
                var types = ['javascript', 'js'];
                if (data.type) { types.push(data.type); }
                var type = '(?:' + types.join('|') + ')';
                // This regexp matches:
                // leading type- type. type_
                // trailing -type .type _type and/or -js .js _js
                var re = new RegExp('^' + type + '[\\-\\._]?|(?:[\\-\\._]?' + type + ')?(?:[\\-\\._]?js)?$', 'ig');
                // Strip the above stuff from the current dirname.
                var name = path.basename(process.cwd()).replace(re, '');
                // Remove anything not a letter, number, dash, dot or underscore.
                name = name.replace(/[^\w\-\.]/g, '');
                // Replace dashes with dots
                name = name.replace(/\-/g, '.');
                done(null, 'com.' + name);
            }
        },
        init.prompt('description'),
        init.prompt('version'),
        {
            name: 'author_name',
            message: 'Author Name',
            validator: /^[a-zA-Z0-9\s\.]+$/,
            warning: 'Can only contain letters, numbers, periods and spaces.',
            default: function (value, data, done)
            {
                // Attempt to pull the data from the user's git config.
                grunt.util.spawn({
                    cmd: 'git',
                    args: ['config', '--get', 'user.name'],
                    fallback: 'none'
                }, done);
            }
        },
        {
            name: 'products',
            message: 'Supported Creative Cloud Products',
            validator: function (value)
            {
                var items = sanitize_products(value, supported_products);
                return items.length > 0;
            },
            sanitize: function (value, data, done)
            {
                var items = sanitize_products(value, supported_products);
                done(JSON.stringify(items));
            },
            warning: 'Please list (comma-separated). Options: ' + supported_products.join(', ') + '.',
            default: 'photoshop'
        },
    ],
    function (err, props)
    {
        // Add other properties
        props.year = (new Date()).getFullYear();
        props.basename = props.name.replace(/[\s]+/g, '-').toLowerCase();
        props.devDependencies = {
            'grunt-cep': '~0.2.0',
        };

        // Files to copy (and process)
        var files = init.filesToCopy(props);

        // Actually copy (and process) files
        init.copyAndProcess(files, props, { noProcess: ['bundle/*.png', 'bundle/*.xml', 'bundle/*.mxi', 'src/js/lib/**', 'src/icons/**'] });

        // All done!
        done();
    });
};