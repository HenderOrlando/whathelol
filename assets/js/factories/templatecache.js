/**
 * Created by hender on 11/02/16.
 */

(function(){
    'use strict';

    /**
     * @ngdoc service
     * @name SolucionesCucutaApp.templateCache
     * @description
     * # templateCache
     * Factory in the SolucionesCucutaApp.
     */
    angular.module('SolucionesCucutaApp')
        .factory('templateCache', templateCache);

    function templateCache($rootScope, $http, $templateCache) {
        var urlBase ='assets/templates/[templateName].html';
        //console.log(getHtml('login'));

        return {
            getUri:     getUri,
            getHtml:    getHtml,
            'get':      getName,
            getForm:    getForm
        };

        function getUri(name, noValid){
            if(noValid !== true){
                addToTemplateCache(name);
            }
            return urlBase.replace('[templateName]',name);
        }

        function getHtml(name, noValid){
            if(noValid !== true){
                addToTemplateCache(name);
            }
            return JST[getUri(name)]();
        }

        function getName(name){
            addToTemplateCache(name);
            return name;
        }

        function getForm(name){
            addToTemplateCache('forms/' + name);
            return 'forms/' + name;
        }

        function addToTemplateCache(name){
            var uri = getUri(name, true);
            if(
                !!JST[uri] &&
                angular.isFunction(JST[uri]) &&
                !$templateCache.get(name)
            ){
                //console.log(name)
                $templateCache.put(name, JST[uri]());
            }
            //console.log(!!$templateCache.get(name));
        }
    }

})();
