/**
 * Created by hender on 10/02/16.
 */
/**
 * `bower`
 *
 * ---------------------------------------------------------------
 *
 * Compile your Bower files into public.
 *
 * For usage docs see:
 *   https://github.com/curist/grunt-bower
 *
 */
module.exports = function(grunt) {
    grunt.config.set('bower', {
        dev: {
            dest: '.tmp/public',
            js_dest: '.tmp/public/js/dependencies',
            css_dest: '.tmp/public/styles/dependencies',
            fonts_dest: '.tmp/public/fonts/',
            images_dest: '.tmp/public/images/',
            options: {
                packageSpecific: {
                    "tinymce-dist": {
                        dest: '.tmp/public/js/dependencies/',
                        css_dest: '.tmp/public/js/dependencies/',
                        fonts_dest: '.tmp/public/js/dependencies/',
                        images_dest: '.tmp/public/js/dependencies/',
                        files: [
                            "tinymce.min.js",
                            "jquery.tinymce.min.js",
                            "themes/*/*.min.js",
                            "themes/*/*/*.min.js",
                            "plugins/*.min.js",
                            "plugins/*/*.min.js",
                            "skins/*/*.min.css",
                            "skins/*/fonts/*",
                            "skins/*/img/*"
                        ]
                    },
                    "moment": {
                        files: [
                            "min/moment-with-locales.js"
                        ]
                    },
                    "angular": {
                        files: [
                            "angular.js",
                            "angular-csp.css"
                        ]
                    },
                    "sweetalert": {
                        files: [
                            "dist/sweetalert.min.js",
                            "dist/sweetalert.css"
                        ]
                    },
                    "codemirror": {
                        files: [
                            "lib/*",
                            //"theme/*"
                            "theme/yeti.css"
                        ]
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-bower');

};
