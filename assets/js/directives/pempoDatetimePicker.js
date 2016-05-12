/**
 * Created by hender on 29/03/16.
 */
(function(){
    'use strict';

    /**
     * @ngdoc function
     * @name SolucionesCucutaApp.directive:pempoDatetimePicker
     * @description
     * # pempoDatetimePicker
     * PempoDatetimePicker
     */
    angular.module('SolucionesCucutaApp')
        .directive('pempoDatetimePicker', [
            '$mdDialog',
            'templateCache',
            pempoDatetimePickerDirective
        ])
    ;

    function pempoDatetimePickerDirective (
        $mdDialog,
        templateCache
    ) {
        var VIEW_STATES = {
            DATE: 0,
            HOUR: 1,
            MINUTE: 2
        };
        return {
            restrict: 'A',
            require: 'ngModel',
            transclude: true,
            scope: {
                currentDate: '=ngModel',
                time: '=',
                date: '=',
                minDate: '=',
                maxDate: '=',
                shortTime: '=',
                format: '@',
                cancelText: '@',
                okText: '@',
                lang: '@',
                amText: '@',
                pmText: '@',
                placeholder: '@'
            },
            link: function (scope, element, attrs, ngModel) {
                var isOn = false;
                if (!scope.format) {
                    if (scope.date && scope.time) {
                        scope.format = 'YYYY-MM-DD HH:mm:ss';
                    } else if (scope.date) {
                        scope.format = 'YYYY-MM-DD';
                    } else {
                        scope.format = 'HH:mm';
                    }
                }

                if (angular.isString(scope.currentDate) && scope.currentDate !== '') {
                    scope.currentDate = moment(scope.currentDate, scope.format);
                }

                if (ngModel) {
                    ngModel.$formatters.push(function (value) {
                        if (typeof value === 'undefined') {
                            return;
                        }
                        var m = moment(value);
                        return m.isValid() ? m.format(scope.format) : '';
                    });
                }

                element.attr('readonly', '');
                //@TODO custom event to trigger input
                element.on('focus', function (e) {
                    e.preventDefault();
                    element.blur();
                    if (isOn) {
                        return;
                    }
                    isOn = true;
                    var options = {};
                    for (var i in attrs) {
                        if (scope.hasOwnProperty(i) && !angular.isUndefined(scope[i])) {
                            options[i] = scope[i];
                        }
                    }
                    options.currentDate = scope.currentDate;
                    var locals = {options: options};
                    $mdDialog.show({
                            template: templateCache.getHtml('pempodatetimepicker'),
                            controller: 'PempoDatetimePickerCtrl',
                            controllerAs: 'picker',
                            locals: locals,
                            openFrom: element,
                            parent: angular.element(document.body),
                            bindToController: true,
                            clickOutsideToClose:true,
                            //disableParentScroll: false
                        })
                        .then(function (v) {
                            scope.currentDate = v ? v._d : v;
                            isOn = false;
                        }, function () {
                            isOn = false;
                        })
                    ;
                });
            }
        };
    }
})();
