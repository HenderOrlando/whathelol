/**
 * Created by hender on 11/02/16.
 */
(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name SolucionesCucutaApp.pempoHttpInterceptor
     * @description
     * # pempoHttpInterceptor
     * Factory in the SolucionesCucutaApp.
     */
    angular.module('SolucionesCucutaApp')
        .factory('pempoHttpInterceptor', [
            '$q',
            '$rootScope',
            '$log',
            'pempoLocalStorage',
            pempoHttpInterceptor
        ]);

    function pempoHttpInterceptor($q, $rootScope, $log, pempoLocalStorage) {
        var
            xhrCreations   = 0,
            xhrResolutions = 0,
            storage = pempoLocalStorage
        ;

        function isLoading() {
            return xhrResolutions < xhrCreations;
        }

        function updateStatus() {
            $rootScope.loading = isLoading();
        }

        return {
            request:       function (config) {
                xhrCreations++;
                updateStatus();
                config.headers = config.headers || {};
                if (storage.token) {
                    config.headers.Authorization = 'Bearer ' +  storage.token;
                }
                return config || $q.when(config);
                //return config;
            },
            requestError:  function (rejection) {
                xhrResolutions++;
                updateStatus();
                $log.error('Request error:', rejection);
                return $q.reject(rejection);
            },
            response:      function (response) {
                xhrResolutions++;
                updateStatus();
                return response || $q.when(response);;
            },
            responseError: function (rejection) {
                xhrResolutions++;
                updateStatus();
                $log.error('Response error:', rejection);
                /*var error        = rejecttion.data;
                 $rootScope.login = error.error_description.indexOf('invalid') >= 0;
                 $rootScope.refresh = error.error_description.indexOf('expired') >= 0;*/
                return $q.reject(rejection);
            }
        };
    }
})();
