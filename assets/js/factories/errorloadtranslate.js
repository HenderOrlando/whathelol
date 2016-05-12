/**
 * Created by hender on 11/02/16.
 */

(function(){
    'use strict';

    /**
     * @ngdoc service
     * @name SolucionesCucutaApp.errorLoadTranslate
     * @description
     * # errorLoadTranslate
     * Factory in the SolucionesCucutaApp.
     */
    angular.module('SolucionesCucutaApp')
        .factory('errorLoadTranslate', ["$q","$log",errorLoadTranslate]);

    function errorLoadTranslate($q, $log) {
        return function (part, lang) {
            $log.error('The "' + part + '/' + lang + '" part was not loaded.');
            return $q.when({});
        };
    }

})();
