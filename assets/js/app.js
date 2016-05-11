/**
 * Created by hender on 24/01/16.
 */

(function(){
    'use strict';

    angular.module(
        'whathelol',
        [
            'ui.router',
            'ui.bootstrap'
        ]
    ).config(
        ['$stateProvider',   '$urlRouterProvider', configRoutes]
    )
    ;
    function configRoutes($stateProvider,   $urlRouterProvider){
        $urlRouterProvider
            .otherwise('/')
        ;
        $stateProvider
            .state('homepage', {
                url: "/",
                templateUrl: '/templates/todo.html',
                controller: 'TodoCtrl'
            })
        ;
    }

})();