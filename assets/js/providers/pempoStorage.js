/**
 * Created by hender on 28/03/16.
 */
(function(){
    'use strict';

    /**
     * @ngdoc function
     * @name SolucionesCucutaApp.controller:IndexCtrl
     * @description
     * # IndexCtrl
     * Controller of the SolucionesCucutaApp
     */
    angular.module('SolucionesCucutaApp')
        .provider('pempoLocalStorage', pempoStorageProvider('localStorage'))
        .provider('pempoSessionStorage', pempoStorageProvider('sessionStorage'))
    ;

    function pempoStorageProvider(storageType) {
        return function () {
            var
                storageKeyPrefix = 'ngStorage-',
                storageSetName = 'setItem',
                storageGetName = 'getItem',
                storageRemoveName = 'removeItem'
                ;

            this.setKeyPrefix = function (prefix) {
                if (typeof prefix !== 'string') {
                    throw new TypeError('[ngStorage] - ' + storageType + 'Provider.setKeyPrefix() expects a String.');
                }
                storageKeyPrefix = prefix.replace('==','');
            };

            var serializer = angular.toJson;
            var deserializer = angular.fromJson;

            this.setSerializer = function (s) {
                if (typeof s !== 'function') {
                    throw new TypeError('[ngStorage] - ' + storageType + 'Provider.setSerializer expects a function.');
                }

                serializer = s;
            };

            this.setDeserializer = function (d) {
                if (typeof d !== 'function') {
                    throw new TypeError('[ngStorage] - ' + storageType + 'Provider.setDeserializer expects a function.');
                }

                deserializer = d;
            };

            this.setSetName = function(setName){
                if (typeof setName !== 'string') {
                    throw new TypeError('[ngStorage] - ' + storageType + 'Provider.setSetName() expects a String.');
                }else if(typeof window[storageType][setName] !== 'function'){
                    throw new TypeError('[ngStorage] - ' + storageType + 'Provider.setSetName() -' + setName + ' will be a Function.');
                }else{
                    storageSetName = setName;
                }
            };

            this.setGetName = function(getName){
                if (typeof getName !== 'string') {
                    throw new TypeError('[ngStorage] - ' + storageType + 'Provider.setGetName() expects a String.');
                }else if(typeof window[storageType][getName] !== 'function'){
                    throw new TypeError('[ngStorage] - ' + storageType + 'Provider.setGetName() -' + getName + ' will be a Function.');
                }else{
                    storageGetName = getName;
                }
            };

            this.setRemoveName = function(removeName){
                if (typeof removeName !== 'string') {
                    throw new TypeError('[ngStorage] - ' + storageType + 'Provider.setGetName() expects a String.');
                }else if(typeof window[storageType][removeName] !== 'function'){
                    throw new TypeError('[ngStorage] - ' + storageType + 'Provider.setGetName() -' + removeName + ' will be a Function.');
                }else{
                    storageRemoveName = removeName;
                }
            };

            // Note: This is not very elegant at all.
            this.get = function (key) {
                //return deserializer(window[storageType].getItem(storageKeyPrefix + key));
                return deserializer(window[storageType][storageGetName](storageKeyPrefix + key));
            };

            // Note: This is not very elegant at all.
            this.set = function (key, value) {
                //return window[storageType].setItem(storageKeyPrefix + key, serializer(value));
                return window[storageType][storageSetName](storageKeyPrefix + key, serializer(value));
            };

            this.$get = [
                '$rootScope',
                '$window',
                '$log',
                '$timeout',
                '$document',

                function(
                    $rootScope,
                    $window,
                    $log,
                    $timeout,
                    $document
                ){
                    function isStorageSupported(storageType) {
                        // Some installations of IE, for an unknown reason, throw "SCRIPT5: Error: Access is denied"
                        // when accessing window.localStorage. This happens before you try to do anything with it. Catch
                        // that error and allow execution to continue.

                        // fix 'SecurityError: DOM Exception 18' exception in Desktop Safari, Mobile Safari
                        // when "Block cookies": "Always block" is turned on
                        var supported;
                        try {
                            supported = $window[storageType];
                        }
                        catch (err) {
                            supported = false;
                        }

                        // When Safari (OS X or iOS) is in private browsing mode, it appears as though localStorage
                        // is available, but trying to call .setItem throws an exception below:
                        // "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to add something to storage that exceeded the quota."
                        if (supported && storageType === 'localStorage') {
                            var key = '__' + Math.round(Math.random() * 1e7);

                            try {
                                //localStorage.setItem(key, key);
                                localStorage[storageSetName](key, key);
                                //localStorage.removeItem(key);
                                localStorage[storageRemoveName](key);
                            }
                            catch (err) {
                                supported = false;
                            }
                        }

                        return supported;
                    }

                    // The magic number 10 is used which only works for some keyPrefixes...
                    // See https://github.com/gsklee/ngStorage/issues/137
                    var prefixLength = storageKeyPrefix.length;

                    var functions = {
                        /*setItem: angular.noop,
                        getItem: angular.noop,
                        removeItem: angular.noop*/
                    };
                    functions[storageSetName] = angular.noop;
                    functions[storageGetName] = angular.noop;
                    functions[storageRemoveName] = angular.noop;

                    // #9: Assign a placeholder object if Web Storage is unavailable to prevent breaking the entire AngularJS blog
                    var webStorage = isStorageSupported(storageType) || ($log.warn('This browser does not support Web Storage!'), functions),
                        $storage = {
                            $default: function(items) {
                                for (var k in items) {
                                    angular.isDefined($storage[k]) || ($storage[k] = angular.copy(items[k]) );
                                }

                                $storage.$sync();
                                return $storage;
                            },
                            $reset: function(items) {
                                for (var k in $storage) {
                                    //'$' === k[0] || (delete $storage[k] && webStorage.removeItem(storageKeyPrefix + k));
                                    '$' === k[0] || (delete $storage[k] && webStorage[storageRemoveName](storageKeyPrefix + k));
                                }

                                return $storage.$default(items);
                            },
                            $sync: function () {
                                for (var i = 0, l = webStorage.length, k; i < l; i++) {
                                    // #8, #10: `webStorage.key(i)` may be an empty string (or throw an exception in IE9 if `webStorage` is empty)
                                    //(k = webStorage.key(i)) && storageKeyPrefix === k.slice(0, prefixLength) && ($storage[k.slice(prefixLength)] = deserializer(webStorage.getItem(k)));
                                    (k = webStorage.key(i)) && storageKeyPrefix === k.slice(0, prefixLength) && ($storage[k.slice(prefixLength)] = deserializer(webStorage[storageGetName](k)));
                                }
                            },
                            $apply: function() {
                                var temp$storage;

                                _debounce = null;

                                if (!angular.equals($storage, _last$storage)) {
                                    temp$storage = angular.copy(_last$storage);
                                    angular.forEach($storage, function(v, k) {
                                        if (angular.isDefined(v) && '$' !== k[0]) {
                                            //webStorage.setItem(storageKeyPrefix + k, serializer(v));
                                            webStorage[storageSetName](storageKeyPrefix + k, serializer(v));
                                            delete temp$storage[k];
                                        }
                                    });

                                    for (var k in temp$storage) {
                                        //webStorage.removeItem(storageKeyPrefix + k);
                                        webStorage[storageRemoveName](storageKeyPrefix + k);
                                    }

                                    _last$storage = angular.copy($storage);
                                }
                            }
                        },
                        _last$storage,
                        _debounce;

                    $storage.$sync();

                    _last$storage = angular.copy($storage);

                    $rootScope.$watch(function() {
                        _debounce || (_debounce = $timeout($storage.$apply, 100, false));
                    });

                    // #6: Use `$window.addEventListener` instead of `angular.element` to avoid the jQuery-specific `event.originalEvent`
                    $window.addEventListener && $window.addEventListener('storage', function(event) {
                        if (!event.key) {
                            return;
                        }

                        // Reference doc.
                        var doc = $document[0];

                        if ( (!doc.hasFocus || !doc.hasFocus()) && storageKeyPrefix === event.key.slice(0, prefixLength) ) {
                            event.newValue ? $storage[event.key.slice(prefixLength)] = deserializer(event.newValue) : delete $storage[event.key.slice(prefixLength)];

                            _last$storage = angular.copy($storage);

                            $rootScope.$apply();
                        }
                    });

                    $window.addEventListener && $window.addEventListener('beforeunload', function() {
                        $storage.$apply();
                    });

                    return $storage;
                }
            ];
        };
    }
})();
