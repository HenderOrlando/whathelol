/**
 * Created by hender on 27/01/16.
 */
module.exports = function(grunt) {
    var
        dest = '.tmp/public',
        jsDest = dest + '/js',
        cssDest = dest + '/styles',
        fontDest = dest + '/fonts',
        imagesDest = dest + '/images'
        ;
    grunt.config.set('bower', {
        dev: {
            dest: dest,
            js_dest: jsDest,
            css_dest: cssDest,
            fonts_dest: fontDest,
            images_dest: imagesDest,
            options: {
                packageSpecific: {
                    "jquery":{
                        dest: dest,
                        js_dest: jsDest,
                        css_dest: cssDest,
                        weight: -5
                    },
                    "jqplot":{
                        dest: dest,
                        js_dest: jsDest,
                        css_dest: cssDest,
                        weight: -4
                    },
                    "moment":{
                        dest: dest,
                        js_dest: jsDest,
                        css_dest: cssDest,
                        weight: -3
                    },
                    "tinymce-dist":{
                        dest: dest,
                        js_dest: jsDest,
                        css_dest: cssDest,
                        weight: -2,
                        files: [
                            "tinymce.js",
                            "tinymce.jquery.js"
                        ]
                    },
                    "angular":{
                        dest: dest,
                        js_dest: jsDest,
                        css_dest: cssDest,
                        weight: -1
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower');

};
/*'/bower_components/jquery/dist/jquery.js',
 '/bower_components/jqplot/jquery.jqplot.js',
 '/bower_components/moment/moment.js',
 '/bower_components/tinymce-dist/tinymce.js',
 '/bower_components/tinymce-dist/tinymce.jquery.js',
 '/bower_components/angular/angular.js',
 '/bower_components/angular-animate/angular-animate.js',
 '/bower_components/angular-bootstrap/ui-bootstrap.js',
 '/bower_components/angular-bootstrap/ui-tpls.js',
 '/bower_components/angular-cookie/angular-cookies.js',
 '/bower_components/angular-mocks/angular-mocks.js',
 '/bower_components/angular-moment/angular-moment.js',
 '/bower_components/angular-resource/angular-resource.js',
 '/bower_components/angular-route/angular-route.js',
 '/bower_components/angular-sanitize/angular-sanitize.js',
 '/bower_components/angular-touch/angular-touch.js',
 '/bower_components/angular-ui-chart/src/chart.js',
 '/bower_components/angular-ui-layout/src/ui-layout.js',
 '/bower_components/angular-ui-mask/dist/mask.js',
 '/bower_components/angular-ui-mention/dist/mention.js',
 '/bower_components/angular-ui-router/release/angular-ui-router.js',
 '/bower_components/angular-ui-scrollpoint/dist/scrollpoint.js',
 '/bower_components/angular-ui-tinymce/src/tinymce.js',
 '/bower_components/angular-ui-tour/dist/angular-ui-tour.js',
 '/bower_components/angular-ui-uploader/dist/uploader.js',
 '/bower_components/angular-ui-validate/dist/validate.js',
 '/bower_components/ngSmothScroll/dist/angular-smoth-scroll.min.js',*/