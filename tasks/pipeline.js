/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 *
 * For more information see:
 *   https://github.com/balderdashy/sails-docs/blob/master/anatomy/myApp/tasks/pipeline.js.md
 */


// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
    'styles/dependencies/angular.csp.css',
    'styles/dependencies/dist/sweetalert.css',
    'styles/dependencies/lib/codemirror.css',
    'styles/dependencies/angular-material.css',
    'styles/**/*.css'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [

    // Load sails.io before everything else
    'js/dependencies/sails.io.js',
    'js/dependencies/lodash.js',
    'js/dependencies/dist/jquery.js',
    'js/dependencies/dist/sweetalert.min.js',
    'js/dependencies/min/moment-with-locales.js',
    'js/dependencies/tinymce.min.js',
    'js/dependencies/jquery.tinymce.min.js',
    'js/dependencies/lib/codemirror.js',
    'js/dependencies/dist/api-check.js',
    'js/dependencies/angular.js',
    'js/dependencies/angular-resource.js',
    'js/dependencies/dist/formly.js',
    'js/dependencies/SweetAlert.js',
    'js/dependencies/angular-aria.js',
    'js/dependencies/angular-cookies.js',
    'js/dependencies/angular-moment.js',
    'js/dependencies/src/tinymce.js',
    'js/dependencies/angular-animate.js',
    'js/dependencies/angular-messages.js',
    'js/dependencies/angular-sanitize.js',
    'js/dependencies/ui-codemirror.js',
    'js/dependencies/dist/uploader.js',
    'js/dependencies/release/angular-ui-router.js',
    'js/dependencies/angular-material.js',
    'js/dependencies/src/sailsResource.js',
    'js/dependencies/angular-mocks.js',
    'js/dependencies/angular-translate.js',
    'js/dependencies/angular-translate-loader-partial.js',
    'js/dependencies/dist/formly-material.js',
    //'/bower_components/angular-material/angular-material-mocks.js',

    // Dependencies like jQuery, or Angular are brought in here
    'js/blog.js',
    'js/dependencies/**/*.js',

    // All of the rest of your client-side js files
    // will be injected here in no particular order.
    'js/**/*.js'
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
    'templates/**/*.html'
];







// Default path for public folder (see documentation for more information)
var tmpPath = '.tmp/public/';

// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function(cssPath) {
    return require('path').join(tmpPath, cssPath);
});
module.exports.jsFilesToInject = jsFilesToInject.map(function(jsPath) {
    return require('path').join(tmpPath, jsPath);
});
module.exports.templateFilesToInject = templateFilesToInject.map(function(tplPath) {
    return require('path').join('assets/',tplPath);
});


