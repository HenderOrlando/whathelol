/**
 * Created by hender on 29/03/16.
 */
(function(){
    'use strict';

    /**
     * @ngdoc function
     * @name SolucionesCucutaApp.directive:pempoDatetimeCalendarMonth
     * @description
     * # pempoDatetimeCalendarMonth
     * PempoDatetimeCalendarMonth
     */
    angular.module('SolucionesCucutaApp')
        .directive('pempoDatetimeCalendarMonth', [
            'templateCache',
            '$compile',
            pempoDatetimeCalendarMonthDirective
        ])
    ;

    function pempoDatetimeCalendarMonthDirective (
        templateCache,
        $compile
    ) {
        var buildCalendarContent = function (element, scope) {
            var gridlist = angular.element(element[0].querySelector('#pempo-datetime-picker-days-list'));
            var calendar = scope.cal, month = scope.month;
            gridlist.html('');
            month.days.forEach(function (weekDays, i) {
                weekDays.forEach(function (weekDay, j) {
                    var gridTile = angular.element('<md-grid-tile></md-grid-tile>');
                    if (weekDay) {
                        var aOrSpan;
                        if (calendar.isInRange(weekDay)) {
                            //build a
                            var scopeRef = 'month["days"][' + i + '][' + j + ']';
                            aOrSpan = angular.element("<md-button class='md-icon-button' href='#' pempo-no-click></md-button>")
                                .attr('ng-class', '{"md-accent": cal.isSelectedDay(' + scopeRef + ')}')
                                .attr('ng-click', 'cal.selectDate(' + scopeRef + ')')
                            ;
                        } else {
                            aOrSpan = angular.element('<span></span>')
                        }
                        aOrSpan
                            .addClass('pempo-select-day')
                            .html(weekDay.format('D'));
                        gridTile.append(aOrSpan);
                    }
                    gridlist.append(gridTile);
                });
            });
            $compile(gridlist)(scope);
        };

        return {
            scope: {
                idx: '='
            },
            transclude: true,
            require: '^pempoDatetimeCalendar',
            restrict: 'AE',
            template: templateCache.getHtml('pempodatetimecalendarmonth'),
            link: function (scope, element, attrs, calendar) {
                scope.cal = calendar;
                scope.month = calendar.getItemAtIndex(parseInt(scope.idx));
                buildCalendarContent(element, scope);
                scope.$watch(function () {
                    return scope.idx;
                }, function (idx, oldIdx) {
                    if (idx != oldIdx) {
                        scope.month = calendar.getItemAtIndex(parseInt(scope.idx));
                        buildCalendarContent(element, scope);
                    }
                });
            }
        };
    }
})();
