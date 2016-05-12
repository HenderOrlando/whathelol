/**
 * Created by hender on 11/02/16.
 */

(function(){
    'use strict';

    /**
     * @ngdoc function
     * @name pempoApp.controller:DialogCtrl
     * @description
     * # DialogCtrl
     * Controller of the pempoApp
     */
    angular.module('SolucionesCucutaApp')
        .controller('DialogCtrl', [
            "$rootScope",
            "$translatePartialLoader",
            "$mdDialog",
            "msg",
            DialogCtrl
        ]);

    function DialogCtrl($rootScope, $translatePartialLoader, $mdDialog, msg) {
        //console.log('ToastCtrl')
        console.log(msg)

        $translatePartialLoader.addPart('htmlhead');

        var
            vm = this
            ;
        vm.close    = closeDialog;
        vm.title    = msg.title || '';
        vm.actions  = msg.actions;
        vm.text     = msg.text;
        vm.theme    = msg.theme || 'default';
        vm.highlight= msg.highlight;

        function closeDialog($event){
            $event.preventDefault();
            $event.stopPropagation();
            $mdDialog
                .hide()
                .then(function(){

                })
            ;
        }
    }
})();
