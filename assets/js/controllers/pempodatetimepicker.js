/**
 * Created by hender on 11/02/16.
 */

(function(){
    'use strict';

    /**
     * @ngdoc function
     * @name SolucionesCucutaApp.controller:PempoDatetimePickerCtrl
     * @description
     * # PempoDatetimePickerCtrl
     * Controller of the SolucionesCucutaApp
     */
    angular.module('SolucionesCucutaApp')
        .controller('PempoDatetimePickerCtrl', [
            "$rootScope",
            "$scope",
            "$mdDialog",
            "$mdMedia",
            PempoDatetimePickerCtrl
        ]);

    var VIEW_STATES = {
        DATE: 0,
        HOUR: 1,
        MINUTE: 2
    };

    function PempoDatetimePickerCtrl($rootScope, $scope, $mdDialog, $mdMedia) {

        //$translatePartialLoader.addPart('datetime');

        $scope.$watch(function(){
            return $mdMedia('max-width: 500px');
        }, function(isPortrait){
            // true - portrait
            // true - landscape
            $scope.isPortrait = isPortrait;
        });

        this.currentView = VIEW_STATES.DATE;
        this._dialog = $mdDialog;

        this.minDate;
        this.maxDate;

        this._attachedEvents = [];
        this.VIEWS = VIEW_STATES;

        this.params = {
            date: true,
            time: true,
            format: 'YYYY-MM-DD',
            minDate: null,
            maxDate: null,
            currentDate: null,
            //lang: mdcDatetimePickerDefaultLocale,
            lang: moment.locale() || 'es',
            weekStart: 0,
            shortTime: false,
            cancelText: 'Cancel',
            okText: 'OK',
            amText: 'AM',
            pmText: 'PM'
        };

        this.meridien = 'AM';
        this.params = angular.extend(this.params, this.options);
        this.init();
    }
    PempoDatetimePickerCtrl.prototype = {
        init: function () {
            this.timeMode = this.params.time && !this.params.date;
            this.dateMode = this.params.date;
            this.initDates();
            this.start();
        },
        currentNearest5Minute: function () {
            var date = this.currentDate || moment();
            var minutes = (5 * Math.round(date.minute() / 5));
            if (minutes >= 60) {
                minutes = 55; //always push down
            }
            return moment(date).minutes(minutes);
        },
        initDates: function () {
            var that = this;
            var _dateParam = function (input, fallback) {
                var ret = null;
                if (angular.isDefined(input) && input !== null && input !== '') {
                    if (angular.isString(input)) {
                        if (typeof(that.params.format) !== 'undefined' && that.params.format !== null) {
                            ret = moment(input, that.params.format).locale(that.params.lang);
                        }
                        else {
                            ret = moment(input).locale(that.params.lang);
                        }
                    }
                    else {
                        if (angular.isDate(input)) {
                            var x = input.getTime();
                            ret = moment(x, "x").locale(that.params.lang);
                        } else if (input._isAMomentObject) {
                            ret = input;
                        }
                    }
                }
                else {
                    ret = fallback;
                }
                return ret;
            };

            this.currentDate = _dateParam(this.params.currentDate, moment());
            this.minDate = _dateParam(this.params.minDate);
            this.maxDate = _dateParam(this.params.maxDate);
            this.selectDate(this.currentDate);
        },
        initDate: function (d) {
            this.currentView = VIEW_STATES.DATE;
        },
        initHours: function () {
            this.currentView = VIEW_STATES.HOUR;
        },
        initMinutes: function () {
            this.currentView = VIEW_STATES.MINUTE;
        },
        isAfterMinDate: function (date, checkHour, checkMinute) {
            var _return = true;

            if (typeof(this.minDate) !== 'undefined' && this.minDate !== null) {
                var _minDate = moment(this.minDate);
                var _date = moment(date);

                if (!checkHour && !checkMinute) {
                    _minDate.hour(0);
                    _minDate.minute(0);

                    _date.hour(0);
                    _date.minute(0);
                }

                _minDate.second(0);
                _date.second(0);
                _minDate.millisecond(0);
                _date.millisecond(0);

                if (!checkMinute) {
                    _date.minute(0);
                    _minDate.minute(0);

                    _return = (parseInt(_date.format("X")) >= parseInt(_minDate.format("X")));
                }
                else {
                    _return = (parseInt(_date.format("X")) >= parseInt(_minDate.format("X")));
                }
            }

            return _return;
        },
        isBeforeMaxDate: function (date, checkTime, checkMinute) {
            var _return = true;

            if (typeof(this.maxDate) !== 'undefined' && this.maxDate !== null) {
                var _maxDate = moment(this.maxDate);
                var _date = moment(date);

                if (!checkTime && !checkMinute) {
                    _maxDate.hour(0);
                    _maxDate.minute(0);

                    _date.hour(0);
                    _date.minute(0);
                }

                _maxDate.second(0);
                _date.second(0);
                _maxDate.millisecond(0);
                _date.millisecond(0);

                if (!checkMinute) {
                    _date.minute(0);
                    _maxDate.minute(0);

                    _return = (parseInt(_date.format("X")) <= parseInt(_maxDate.format("X")));
                }
                else {
                    _return = (parseInt(_date.format("X")) <= parseInt(_maxDate.format("X")));
                }
            }

            return _return;
        },
        selectDate: function (date) {
            if (date) {
                this.currentDate = moment(date);
                if (!this.isAfterMinDate(this.currentDate)) {
                    this.currentDate = moment(this.minDate);
                }

                if (!this.isBeforeMaxDate(this.currentDate)) {
                    this.currentDate = moment(this.maxDate);
                }
                this.currentDate.locale(this.params.lang);
                this.calendarStart = moment(this.currentDate);
                this.meridien = this.currentDate.hour() >= 12 ? 'PM' : 'AM';
            }
        },
        setName: function () {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 5; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            return text;
        },
        isPM: function () {
            return this.meridien === 'PM';
        },
        incrementYear: function (amount) {
            if (amount === 1 && this.isNextYearVisible()) {
                this.selectDate(this.currentDate.add(amount, 'year'));
            }

            if (amount === -1 && this.isPreviousYearVisible()) {
                this.selectDate(this.currentDate.add(amount, 'year'));
            }
        },
        incrementMonth: function (amount) {
            if (amount === 1 && this.isNextMonthVisible()) {
                this.selectDate(this.currentDate.add(amount, 'month'));
            }

            if (amount === -1 && this.isPreviousMonthVisible()) {
                this.selectDate(this.currentDate.add(amount, 'month'));
            }
        },
        isPreviousMonthVisible: function () {
            return this.calendarStart && this.isAfterMinDate(moment(this.calendarStart).startOf('month'), false, false);
        },
        isNextMonthVisible: function () {
            return this.calendarStart && this.isBeforeMaxDate(moment(this.calendarStart).endOf('month'), false, false);
        },
        isPreviousYearVisible: function () {
            return this.calendarStart && this.isAfterMinDate(moment(this.calendarStart).startOf('year'), false, false);
        },
        isNextYearVisible: function () {
            return this.calendarStart && this.isBeforeMaxDate(moment(this.calendarStart).endOf('year'), false, false);
        },
        isHourAvailable: function (hour) {
            var _date = moment(this.currentDate);
            _date.hour(this.convertHours(hour)).minute(0).second(0);
            return this.isAfterMinDate(_date, true, false) && this.isBeforeMaxDate(_date, true, false);
        },
        isMinuteAvailable: function (minute) {
            var _date = moment(this.currentDate);
            _date.minute(minute).second(0);
            return this.isAfterMinDate(_date, true, true) && this.isBeforeMaxDate(_date, true, true);
        },
        start: function () {
            this.currentView = VIEW_STATES.DATE;
            //this.initDates();
            if (this.params.date) {
                this.initDate();
            } else {
                if (this.params.time) {
                    this.initHours();
                }
            }
        },
        ok: function () {
            switch (this.currentView) {
                case VIEW_STATES.DATE:
                    if (this.params.time === true) {
                        this.initHours();
                    }
                    else {
                        this.hide(true);
                    }
                    break;
                case VIEW_STATES.HOUR:
                    this.initMinutes();
                    break;
                case VIEW_STATES.MINUTE:
                    this.hide(true);
                    break;
            }
        },
        cancel: function () {
            if (this.params.time) {
                switch (this.currentView) {
                    case VIEW_STATES.DATE:
                        this.hide();
                        break;
                    case VIEW_STATES.HOUR:
                        if (this.params.date) {
                            this.initDate();
                        }
                        else {
                            this.hide();
                        }
                        break;
                    case VIEW_STATES.MINUTE:
                        this.initHours();
                        break;
                }
            }
            else {
                this.hide();
            }
        },
        selectMonthBefore: function () {
            this.calendarStart.subtract(1, 'months');
        },
        selectMonthAfter: function () {
            this.calendarStart.add(1, 'months');
        },
        selectYearBefore: function () {
            this.calendarStart.subtract(1, 'years');
        },
        selectYearAfter: function () {
            this.calendarStart.add(1, 'years');
        },
        selectAM: function () {
            if (this.isHourAvailable(0) || this.isHourAvailable(12)) {
                if (this.currentDate.hour() >= 12) {
                    this.selectDate(this.currentDate.subtract(12, 'hours'));
                }
                if (!this.isHourAvailable(this.currentDate.hour())) {
                    this.selectDate(this.currentDate.hour(this.minDate.hour()));
                }
                if (!this.isMinuteAvailable(this.currentDate.minute())) {
                    this.selectDate(this.currentDate.minute(this.minDate.minute()));
                }
            }
        },
        selectPM: function () {
            if (this.isHourAvailable(13) || this.isHourAvailable(24)) {
                if (this.currentDate.hour() < 12) {
                    this.selectDate(this.currentDate.add(12, 'hours'));
                }
                if (!this.isHourAvailable(this.currentDate.hour())) {
                    this.selectDate(this.currentDate.hour(this.maxDate.hour()));
                }
                if (!this.isMinuteAvailable(this.currentDate.minute())) {
                    this.selectDate(this.currentDate.minute(this.maxDate.minute()));
                }
            }
        },
        convertHours: function (h) {
            var _return = h;
            if ((h < 12) && this.isPM())
                _return += 12;

            return _return;
        },
        hide: function (okBtn) {
            if (okBtn) {
                this._dialog.hide(this.currentDate);
            } else {
                this._dialog.cancel();
            }
        }
    };
})();
