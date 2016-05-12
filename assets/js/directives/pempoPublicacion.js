/**
 * Created by hender on 29/03/16.
 */
(function(){
    'use strict';

    /**
     * @ngdoc function
     * @name SolucionesCucutaApp.directive:pempoPublicacion
     * @description
     * # pempoPublicacion
     * PempoPublicacion
     */
    angular.module('SolucionesCucutaApp')
        .directive('pempoPublicacion', [
            '$window',
            'templateCache',
            '$timeout',
            pempoPublicacionDirective
        ])
    ;

    function pempoPublicacionDirective ($window, templateCache, $timeout) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                publicaciones: '='
            },
            template: templateCache.getHtml('publicacion'),
            link: function (scope, $element, attrs) {
                //console.log(scope.publicaciones)
            }
        };
    }
})();
