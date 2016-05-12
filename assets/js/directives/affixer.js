/**
 * Created by hender on 29/03/16.
 */
(function(){
    'use strict';

    angular.module('SolucionesCucutaApp')
        .directive('affixer', ['$window', affixerDirective])
    ;

    function affixerDirective ($window) {
        return {
            restrict: 'A',
            link: function ($scope, $element) {
                var win = angular.element($window);
                var topOffset = $element[0].offsetTop;

                function affixElement() {

                    //console.log($window.pageYOffset);

                    if ($window.pageYOffset > topOffset) {
                        $element.css('position', 'fixed');
                        $element.css('top', '0px');
                    } else {
                        $element.css('position', '');
                        $element.css('top', '');
                    }
                }

                $scope.$on('$routeChangeStart', function() {
                    win.unbind('scroll', affixElement);
                });
                win.bind('scroll', affixElement);
            }
        };
    }
})();
