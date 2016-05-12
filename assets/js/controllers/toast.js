/**
 * Created by hender on 11/02/16.
 */

(function(){
    'use strict';

    /**
     * @ngdoc function
     * @name pempoApp.controller:ToastCtrl
     * @description
     * # ToastCtrl
     * Controller of the pempoApp
     */
    angular.module('SolucionesCucutaApp')
        .controller('ToastCtrl', [
            "$rootScope",
            "$translatePartialLoader",
            "$mdToast",
            "msg",
            ToastCtrl
        ]);

    function ToastCtrl($rootScope, $translatePartialLoader, $mdToast, msg) {
        //console.log('ToastCtrl')
        //console.log(msg)

        $translatePartialLoader.addPart('htmlhead');

        var
            vm = this
            ;
        vm.close = closeToast;
        vm.text = msg.text;
        vm.link = msg.link;
        vm.theme = msg.theme || 'default';
        vm.highlight = msg.highlight;
        vm.onClick = onClick;

        function onClick($event){
            closeToast($event);
            vm.link.onClick($event);
        }

        function closeToast($event){
            $event.preventDefault();
            $event.stopPropagation();
            $mdToast
                .hide()
                .then(function(){

                })
            ;
        }
    }
})();
