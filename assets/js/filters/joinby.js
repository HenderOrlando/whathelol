/**
 * Created by hender on 24/03/16.
 */

(function(){
    'use strict';

    /**
     * @ngdoc function
     * @name SolucionesCucutaApp.filter:joinBy
     * @description
     * # JoinBy
     * Filter
     */
    angular.module('SolucionesCucutaApp')
        .filter('joinBy', joinBy);
    function joinBy() {
        return function (input,delimiter) {
            if(angular.isArray(input)){
                if(angular.isObject(input[0])){
                    //console.log(input);
                    input = input.map(function(val){
                        return val.nombre || val;
                    });
                }
                if(angular.isString(input[0])){
                    input = input.join(delimiter || ', ');
                }
                if(input.length < 1){
                    input = '';
                }
            }
            return input;
        };
    }
})();
