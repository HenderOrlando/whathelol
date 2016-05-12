/**
 * Created by hender on 29/03/16.
 */
(function(){
    'use strict';

    angular.module('SolucionesCucutaApp')
        .directive('pempoSlide', [
            '$window',
            'templateCache',
            '$timeout',
            pempoSlideDirective
        ])
    ;

    function pempoSlideDirective ($window, templateCache, $timeout) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                autoslide: '@',
                slideSize: '@',
                slideIn: '@',
                withFade: '@',
                adjustTo: '@',
                minHeight: '@',
                images: '='
            },
            template: templateCache.getHtml('slide'),
            link: function (scope, $ele, attrs) {
                scope.images = scope.images || [];
                scope.withFade = scope.withFade === 'true';
                scope.autoslide = scope.autoslide > 0?scope.autoslide:0;
                scope.currentIndex = 0;

                var
                    timer_ = $timeout(),
                    goAutoSlide = scope.autoslide && scope.images.length > 1,
                    parent = angular.element($ele).parent(),
                    adjusts = ['window', 'element'],
                    sizes = ['cover', 'contain'],
                    timer = parseInt(scope.autoslide || 5000),
                    effects = ['top','bottom','left','right'],
                    effectsVs = {
                        'top':      'bottom',
                        'left':     'right',
                        'right':    'left',
                        'bottom':   'top'
                    }
                ;
                if(!scope.slideSize || sizes.indexOf(scope.slideSize) < 0){
                    scope.slideSize = sizes[1];
                }
                if(!scope.adjustTo || adjusts.indexOf(scope.adjustTo) < 0){
                    if(scope.adjustTo[0] !== '#'){
                        scope.adjustTo = adjusts[1];
                    }
                }
                if(scope.adjustTo === 'window'){
                    parent = angular.element($window);
                } else if(scope.adjustTo[0] === '#'){
                    parent = angular.element(scope.adjustTo);
                }
                angular.forEach(scope.images, function(val, key){
                    val.slideEffect = key%2?effectsVs[scope.slideIn]:scope.slideIn;
                });
                if(effects.indexOf(scope.slideIn) < 0){
                    scope.slideIn = effect[0];
                }

                scope.getMinHeight = function(){
                    var h = parent.innerHeight();
                    if(scope.adjustTo === 'window'){
                        h = (h/2) + 54;
                    }
                    //parent.height = h;
                    return h + 'px';
                };
                scope.getMinHeight();
                scope.getMinWidth = function(){
                    return 'auto';
                    //return parent.width() + 'px';
                };

                scope.next = function($event) {
                    //scope.currentIndex < scope.images.length - 1 ? scope.currentIndex++ : scope.currentIndex = 0;
                    resetAutoSlide(!!$event);
                    var
                        entraIndex = scope.currentIndex + 1,
                        saleIndex = scope.currentIndex
                    ;
                    if(entraIndex > scope.images.length - 1){
                        entraIndex = 0;
                        saleIndex = scope.images.length - 1;
                    }
                    var sale = scope.images[saleIndex],
                        entra = scope.images[entraIndex]
                    ;
                    entra.slideEffect = scope.slideIn;
                    sale.slideEffect = effectsVs[scope.slideIn];
                    $timeout(function(){
                        scope.currentIndex = entraIndex;
                    }, 50)
                };

                scope.prev = function($event) {
                    //scope.currentIndex > 0 ? scope.currentIndex-- : scope.currentIndex = scope.images.length - 1;
                    resetAutoSlide(!!$event);
                    var
                        entraIndex = scope.currentIndex - 1,
                        saleIndex = scope.currentIndex
                        ;
                    if(entraIndex < 0){
                        entraIndex = scope.images.length - 1;
                        saleIndex = 0;
                    }
                    var sale = scope.images[saleIndex],
                        entra = scope.images[entraIndex]
                        ;
                    entra.slideEffect = effectsVs[scope.slideIn];
                    sale.slideEffect = scope.slideIn;
                    $timeout(function(){
                        scope.currentIndex = entraIndex;
                    }, 50)
                };

                scope.isCurrent = function(index){
                    return index === scope.currentIndex;
                };

                if(goAutoSlide){
                    var
                        sliderFunc = function(){
                            timer_ = $timeout(function(){
                                scope.next();
                                sliderFunc();
                            }, timer);
                        }
                    ;
                    sliderFunc();
                    scope.$on('$destroy', function(){
                        $timeout.cancel(timer_);
                    });
                }

                function resetAutoSlide(reset){
                    if(goAutoSlide && reset){
                        $timeout.cancel(timer_);
                        sliderFunc();
                    }
                }
            }
        };
    }
})();
