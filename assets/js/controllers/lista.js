/**
 * Created by hender on 11/02/16.
 */

(function(){
    'use strict';

    /**
     * @ngdoc function
     * @name SolucionesCucutaApp.controller:ListaCtrl
     * @description
     * # ListaCtrl
     * Controller of the SolucionesCucutaApp
     */
    angular.module('SolucionesCucutaApp')
        .controller('ListaCtrl', [
            "$rootScope",
            "$mdMedia",
            "$translatePartialLoader",
            "pempoLocalStorage",
            "pempoResource",
            '$state',
            '$mdToast',
            '$mdDialog',
            '$mdBottomSheet',
            'templateCache',
            '$clientid',
            '$clientsecret',
            '$location',
            'Connect',
            '$q',
            '$timeout',
            '$log',
            ListaCtrl]);

    function ListaCtrl(
        $rootScope,
        $mdMedia,
        $translatePartialLoader,
        pempoLocalStorage,
        pempoResource,
        $state,
        $mdToast,
        $mdDialog,
        $mdBottomSheet,
        templateCache,
        $clientid,
        $clientsecret,
        $location,
        Connect,
        $q,
        $timeout,
        $log
    ) {
        console.log('ListaCtrl');

        /*Connect.checkAuthenticated().then(function(isAuthenticated){
            console.log('isAuthenticated', isAuthenticated)
            if(isAuthenticated){
                $log.log('OK')
            }else{
                $log.error('BAD')
            }
        });*/

        $translatePartialLoader.addPart('lista');

        var
            almacen         = pempoLocalStorage,
            vm              = this,
            identity        = {},
            host            = $location.host(),
            path            = $location.path(),
            Usuario         = pempoResource('usuario')
        ;

        Usuario.filter({
            // Rol Empresa
            rol: '5717e66041201db50a61b484'/*,
            etiquetas: []*/
        }).then(function(empresas){
            console.log(empresas)
            vm.empresas = empresas;
        });

        // Initialize Credentials
        //$rootScope.theme            = $rootScope.theme || 'solucionescucuta';
        $rootScope.hideSlideTop     = true;
        $rootScope.hideSlideBottom  = true;
    }
})();
