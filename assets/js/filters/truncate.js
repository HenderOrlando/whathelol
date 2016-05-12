/**
 * Created by hender on 24/03/16.
 */

(function() {
    'use strict';

    /**
     * @ngdoc function
     * @name SolucionesCucutaApp.filter:truncate
     * @description {{ val.str | truncate:number:breakOnWordOrWords }}
     * # truncate
     * Filter
     */
    angular.module('SolucionesCucutaApp')
        .filter('truncate', function () {
            return function (input, number, breakOnWordOrWords) {
                if (isNaN(number)) return input;
                if (number <= 0) return '';
                if (input) {
                    if(breakOnWordOrWords === 'words'){
                        var inputWords = input.split(/\s+/);
                        if (inputWords.length > number) {
                            input = inputWords.slice(0, number).join(' ') + '…';
                        }
                    }else if(input.length > number){
                        input = input.substring(0, number);

                        if (!breakOnWordOrWords) {
                            var lastspace = input.lastIndexOf(' ');
                            //get last space
                            if (lastspace !== -1) {
                                input = input.substr(0, lastspace);
                            }
                        } else {
                            while (input.charAt(input.length - 1) === ' ') {
                                input = input.substr(0, input.length - 1);
                            }
                        }
                        return input + '…';
                    }
                }
                return input;
            };
        })
        /*.filter('splitcharacters', function() {
            return function (input, chars) {
                if (isNaN(chars)) return input;
                if (chars <= 0) return '';
                if (input && input.length > chars) {
                    var prefix = input.substring(0, chars/2);
                    var postfix = input.substring(input.length-chars/2, input.length);
                    return prefix + '...' + postfix;
                }
                return input;
            };
        })*/
    ;
})();
