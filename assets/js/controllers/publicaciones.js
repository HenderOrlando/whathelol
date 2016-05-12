/**
 * Created by hender on 11/02/16.
 */

(function(){
    'use strict';

    /**
     * @ngdoc function
     * @name SolucionesCucutaApp.controller:PublicacionesCtrl
     * @description
     * # PublicacionesCtrl
     * Controller of the SolucionesCucutaApp
     */
    angular.module('SolucionesCucutaApp')
        .controller('PublicacionesCtrl', [
            "$rootScope",
            "$mdMedia",
            "$translatePartialLoader",
            "pempoLocalStorage",
            "pempoResource",
            '$state',
            '$stateParams',
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
            PublicacionesCtrl]);

    function PublicacionesCtrl(
        $rootScope,
        $mdMedia,
        $translatePartialLoader,
        pempoLocalStorage,
        pempoResource,
        $state,
        $stateParams,
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
        console.log('PublicacionesCtrl');

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
            Publicacion     = pempoResource('publicacion')
        ;

        vm.nombre = $stateParams.menuname;
        vm.publicaciones = [];
        $rootScope.setMenuActual(vm.nombre);
        /*vm.lateral = {};
        vm.lateral.publicaciones = [];*/

        checkLoadMenu();

        function loadMenu(){

        }

        /*$rootScope.changeMenu(vm.nombre).then(function(menu){
            console.log(menu)
            pempoResource('estado').read({
                canonical: 'publicado'
            }).then(function(estado){
                Publicacion.filter({
                    estado: estado.id
                }).then(function(publicaciones){
                    vm.publicaciones = publicaciones;
                    //vm.lateral.publicaciones = publicaciones;
                });
            }, function(){
                //estado no encontrado
            });
        }, function(err){
            // Menu no encontrado
        });*/

        /*vm.principales = [
            {
                span: {
                    row: 1,
                    col: 2
                },
                archivo: {
                    src: 'images/cover.jpg',
                    title: 'Soluciones Cúcuta'
                },
                nombre: 'Soluciones Cúcuta'
            },
            {
                span: {
                    row: 1,
                    col: 2
                },
                archivo: {
                    src: 'images/cover-cian.jpg',
                    title: 'Soluciones Cúcuta'
                },
                nombre: 'Soluciones Cúcuta Cian'
            },
            {
                span: {
                    row: 1,
                    col: 1
                },
                archivo: {
                    src: 'images/cover-grey.jpg',
                    title: 'Soluciones Cúcuta'
                },
                nombre: 'Soluciones Cúcuta Grey'
            },
            {
                span: {
                    row: 1,
                    col: 1
                },
                archivo: {
                    src: 'images/cover-magenta.jpg',
                    title: 'Soluciones Cúcuta'
                },
                nombre: 'Soluciones Cúcuta Magenta'
            },
            {
                span: {
                    row: 1,
                    col: 1
                },
                archivo: {
                    src: 'images/cover-cian.jpg',
                    title: 'Soluciones Cúcuta'
                },
                nombre: 'Soluciones Cúcuta Cian 2'
            },
            {
                span: {
                    row: 1,
                    col: 1
                },
                archivo: {
                    src: 'images/cover.jpg',
                    title: 'Soluciones Cúcuta'
                },
                nombre: 'Soluciones Cúcuta 2'
            }
        ];*/

    }
})();
