/**
 * Created by hender on 2/04/16.
 */

(function () {
    'use strict';

    angular.module('SolucionesCucutaApp')
        .directive('pempoSticky', [
            '$mdSticky',
            '$compile',
            '$log',
            pempoSticky]);

    function pempoSticky($mdSticky, $compile, $log) {
        return {
            restrict: 'A',
            replace: true,
            transclude: true,
            template: '<div class="md-sticky-content"></div>',
            compile: pempoStickyLink
        };

        function pempoStickyLink(element, attrs, transclude) {
            return function postLink(scope, element, attr) {
                var outerHTML = element[0].outerHTML;
                //$log.debug(outerHTML);
                transclude(scope, function (clone) {
                    //$log.debug(clone);
                    element.append(clone);
                });

                transclude(scope, function (clone) {
                    var stickyClone = $compile(angular.element(outerHTML).removeAttr("pempo-sticky"))(scope);
                    stickyClone.append(clone);
                    $mdSticky(scope, element, stickyClone);
                });
            };
        }
    }
})();
