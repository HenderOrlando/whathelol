/**
 * Created by hender on 29/03/16.
 */
(function(){
    'use strict';

    /**
     * @ngdoc function
     * @name SolucionesCucutaApp.directive:pempoDatetimeClock
     * @description
     * # pempoDatetimeClock
     * PempoDatetimeClock
     */
    angular.module('SolucionesCucutaApp')
        .directive('pempoDatetimeClock', [
            'templateCache',
            pempoDatetimeClockDirective
        ])
    ;

    function pempoDatetimeClockDirective (templateCache) {
        var css = function (el, name) {
            if ('jQuery' in window) {
                return jQuery(el).css(name);
            } else {
                el = angular.element(el);
                return ('getComputedStyle' in window) ? window.getComputedStyle(el[0])[name] : el.css(name);
            }
        };
        return {
            restrict: 'E',
            template: templateCache.getHtml('pempodatetimeclock'),
            link: function (scope, element, attrs) {
                var minuteMode = attrs.mode === 'minutes';
                var picker = scope.picker;
                //banking on the fact that there will only be one at a time
                var componentRoot = document.querySelector('md-dialog.pempo-datetime-picker');
                var exec = function () {
                    var clock = angular.element(element[0].querySelector('.pempo-datetime-picker-clock')),
                        pickerEl = angular.element(componentRoot.querySelector('.pempo-datetime-picker-picker'));

                    var w = componentRoot.querySelector('.pempo-datetime-picker-content').offsetWidth;
                    var pl = parseInt(css(pickerEl, 'paddingLeft').replace('px', '')) || 0;
                    var pr = parseInt(css(pickerEl, 'paddingRight').replace('px', '')) || 0;
                    var ml = parseInt(css(clock, 'marginLeft').replace('px', '')) || 0;
                    var mr = parseInt(css(clock, 'marginRight').replace('px', '')) || 0;
                    //set width
                    var clockWidth = (w - (ml + mr + pl + pr));
                    clock.css('width', (clockWidth) + 'px');

                    var pL = parseInt(css(pickerEl, 'paddingLeft').replace('px', '')) || 0;
                    var pT = parseInt(css(pickerEl, 'paddingTop').replace('px', '')) || 0;
                    var mL = parseInt(css(clock, 'marginLeft').replace('px', '')) || 0;
                    var mT = parseInt(css(clock, 'marginTop').replace('px', '')) || 0;

                    var r = (clockWidth / 2);
                    //var j = r / 1.2; //???
                    var j = r / 1.5;

                    var points = [];

                    for (var h = 0; h < 12; ++h) {
                        var x = j * Math.sin(Math.PI * 2 * (h / 12));
                        var y = j * Math.cos(Math.PI * 2 * (h / 12));

                        var hour = {
                            left: (r + x + pL / 2) - (pL + mL),
                            top: (r - y - mT / 2) - (pT + mT),
                            value: (minuteMode ? (h * 5) : h) //5 for minute 60/12
                        };

                        if (minuteMode) {
                            hour.display = hour.value < 10 ? ('0' + hour.value) : hour.value;
                        } else {

                            if (picker.params.shortTime) {
                                hour.display = (h === 0) ? 12 : h;
                            } else {
                                hour.display = picker.isPM() ? h + 12 : h;
                            }
                        }


                        points.push(hour);
                    }

                    scope.points = points;
                    setCurrentValue();
                    clock.css('height', clockWidth + 'px');
                    //picker.initHands(true);

                    var clockCenter = element[0].querySelector('.pempo-datetime-picker-clock-center');
                    var centerWidth = (clockCenter.offsetWidth / 2) || 7.5,
                        centerHeight = (clockCenter.offsetHeight / 2) || 7.5;
                    var _hL = r / 1.8;
                    var _mL = r / 1.5;

                    angular.element(element[0].querySelector('.pempo-datetime-picker-hour-hand')).css({
                        left: r + (mL * 1.5) + 'px',
                        height: _hL + 'px',
                        marginTop: (r - _hL - pL) + 'px'
                    }).addClass(!minuteMode ? 'on' : '');

                    angular.element(element[0].querySelector('.pempo-datetime-picker-minute-hand')).css
                    ({
                        left: r + (mL * 1.5) + 'px',
                        height: _mL + 'px',
                        marginTop: (r - _mL - pL) + 'px'
                    }).addClass(minuteMode ? 'on' : '');

                    angular.element(clockCenter).css({
                        left: (r + pL + mL - centerWidth) + 'px',
                        marginTop: (r - (mL / 2)) - centerHeight + 'px'
                    });
                    animateHands();
                };

                var animateHands = function () {
                    var _date = picker.currentNearest5Minute();
                    var h = _date.hour();
                    var m = _date.minute();

                    rotateElement(angular.element(element[0].querySelector('.pempo-datetime-picker-hour-hand')), (360 / 12) * h);
                    var mdg = ((360 / 60) * (5 * Math.round(m / 5)));
                    rotateElement(angular.element(element[0].querySelector('.pempo-datetime-picker-minute-hand')), mdg);
                };

                var rotateElement = function (el, deg) {
                    angular.element(el).css({
                        WebkitTransform: 'rotate(' + deg + 'deg)',
                        '-moz-transform': 'rotate(' + deg + 'deg)'
                    });
                };


                var setCurrentValue = function () {
                    var date = picker.currentNearest5Minute();
                    scope.currentValue = minuteMode ? date.minute() : (date.hour() % 12);
                };

                scope.$watch(function () {
                    var tmp = picker.currentNearest5Minute();
                    return tmp ? tmp.format('HH:mm') : '';
                }, function (newVal) {
                    setCurrentValue();
                    animateHands();
                });


                var setDisplayPoints = function (isPM, points) {
                    for (var i = 0; i < points.length; i++) {
                        points[i].display = i;
                        if (isPM) {
                            points[i].display += 12;
                        }
                    }
                    return points;
                };

                if (!picker.params.shortTime) {
                    scope.$watch('picker.meridien', function () {
                        if (!minuteMode) {
                            if (scope.points) {
                                var points = setDisplayPoints(picker.isPM(), angular.copy(scope.points));
                                scope.points = points;
                            }
                        }
                    });
                }


                scope.setTime = function (val) {
                    if (val === scope.currentValue) {
                        picker.ok();
                    }

                    if (!minuteMode) {
                        picker.currentDate.hour(picker.isPM() ? (val + 12) : val);
                    } else {
                        picker.currentDate.minute(val);
                    }
                    picker.currentDate.second(0)
                };

                scope.pointAvailable = function (point) {
                    return minuteMode ? picker.isMinuteAvailable(point.value) : picker.isHourAvailable(point.value);
                };

                var unwatcher = scope.$watch(function () {
                    return element[0].querySelectorAll('div').length;
                }, function () {
                    exec();
                    unwatcher();
                });
            }
        }
    }
})();
