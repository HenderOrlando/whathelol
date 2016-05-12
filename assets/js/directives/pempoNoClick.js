/**
 * Created by hender on 29/03/16.
 */
(function(){
    'use strict';

    /**
     * @ngdoc function
     * @name SolucionesCucutaApp.directive:pempoNoClick
     * @description
     * # pempoNoClick
     * PempoPublicacion
     */
    angular.module('SolucionesCucutaApp')
        .directive('pempoNoClick', [
            '$window',
            'templateCache',
            '$timeout',
            pempoNoClickDirective
        ])
    ;

    function pempoNoClickDirective () {
        return {
            link: function (scope, el) {
                el.on('click', function (e) {
                    e.preventDefault();
                });
            }
        };
    }
})();
