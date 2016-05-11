/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files, and the ! prefix for excluding files.)
 */

// Path to public folder
var tmpPath = '.tmp/public/';

// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
    '/bower_components/bootwatch/css/bootstrap.css',
    '/bower_components/angular-bootstrap/ui-bootstrap-csp.css',
    '/bower_components/angular-ui-layout/src/ui-layout.css',
    '/bower_components/jqplot/jquery.jqplot.css',

    'styles/**/*.css'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [

    // Load sails.io before everything else
    'js/dependencies/sails.io.js',

    'js/jquery.js',
    'js/dist/jquery.js',
    '/bower_components/jqplot/jquery.jqplot.js',
    'js/moment.js',
    'js/tinymce.js',
    '/bower_components/tinymce-dist/tinymce.jquery.js',
    'js/js/bootstrap.js',
    'js/angular.js',
    'js/angular-animate.js',
    'js/ui-bootstrap.js',
    'js/ui-bootstrap-tpls.js',
    'js/angular-cookies.js',
    'js/angular-mocks.js',
    'js/angular-moment.js',
    'js/angular-resource.js',
    'js/angular-route.js',
    'js/angular-sanitize.js',
    'js/angular-touch.js',
    'js/src/chart.js',
    'js/src/ui-layout.js',
    'js/dist/mask.js',
    'js/dist/mention.js',
    'js/release/angular-ui-router.js',
    'js/dist/scrollpoint.js',
    'js/src/tinymce.js',
    'js/dist/angular-ui-tour.js',
    'js/dist/uploader.js',
    'js/dist/validate.js',
    'js/lib/angular-smooth-scroll.js',

    // Dependencies like jQuery, or Angular are brought in here
    'js/dependencies/**/*.js',

    // All of the rest of your client-side js files
    // will be injected here in no particular order.
    'js/**/*.js'

    // Use the "exclude" operator to ignore files
    // '!js/ignore/these/files/*.js'
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



// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(transformPath);
module.exports.jsFilesToInject = jsFilesToInject.map(transformPath);
module.exports.templateFilesToInject = templateFilesToInject.map(transformPath);

// Transform paths relative to the "assets" folder to be relative to the public
// folder, preserving "exclude" operators.
function transformPath(path) {
    return (path.substring(0,1) == '!') ? ('!' + tmpPath + path.substring(1)) : (tmpPath + path);
}
