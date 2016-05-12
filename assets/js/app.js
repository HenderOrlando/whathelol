/**
 * Created by hender on 10/02/16.
 */
(function(){
    'use strict';

    /**
     * @ngdoc overview
     * @name Pempo
     * @description
     * # SolucionesCucutaApp
     *
     * Main module of the application.
     */
    angular
        .module('SolucionesCucutaApp', [
            'pascalprecht.translate',
            'oitozero.ngSweetAlert',
            'formlyMaterial',
            'angularMoment',
            'ui.codemirror',
            //'infinite-scroll',
            'ngFileUpload',
            'ngSanitize',
            'ui.tinymce',
            'ngMessages',
            'ngMaterial',
            'md.data.table',
            'ui.router',
            'ngCookies',
            'ngAnimate',
            'formly',
            'ngAria'
        ])
        .config(configPempoApp)
        .run(runPempoApp)
    ;

    var
        isAuthenticated = false,
        localeStorage = null
    ;

    function configPempoApp($stateProvider,
                            $urlRouterProvider,
                            $translateProvider,
                            $mdThemingProvider,
                            $mdIconProvider,
                            pempoResourceProvider,
                            pempoLocalStorageProvider,
                            $httpProvider){
        $httpProvider.interceptors.push('pempoHttpInterceptor');
        pempoResourceProvider.configuration = {
            //verbose: true
        };
        pempoLocalStorageProvider.setKeyPrefix('SolucionesCucuta-');
        pempoLocalStorageProvider.setSerializer(customSerializer);
        pempoLocalStorageProvider.setDeserializer(customDeserializer);
        localeStorage = pempoLocalStorageProvider;
        configTheme($mdThemingProvider, $mdIconProvider);
        configTranslate($translateProvider);
        configUiRouter($urlRouterProvider, $stateProvider);
    }

    function configTheme($mdThemingProvider, $mdIconProvider) {
        /**
         * Palettes
         * red, pink, purple, deep-purple, indigo, blue, grey,
         * light-blue, cyan, teal, green, light-green, lime,
         * yellow, amber, orange, deep-orange, brown, blue-grey
         */

        $mdThemingProvider.theme('solucionescucuta')
            .primaryPalette('grey')
            .accentPalette('red')
            .backgroundPalette('grey')
            .warnPalette('orange')
            .dark()
        ;
        $mdThemingProvider.theme('solucionescucutablank')
            .primaryPalette('grey')
            .accentPalette('red')
            .backgroundPalette('grey')
            .warnPalette('orange')
        ;
        $mdThemingProvider.theme('white')
            .primaryPalette('grey')
            .accentPalette('blue-grey')
        ;
        $mdThemingProvider.theme('black')
            .primaryPalette('grey')
            .accentPalette('blue-grey')
            .dark()
        ;
        $mdIconProvider
            //.defaultIconSet('images/material-icons.svg')
            .defaultIconSet('images/mdi.svg')
        ;
        $mdThemingProvider.setDefaultTheme('solucionescucuta');
        $mdThemingProvider.alwaysWatchTheme(true);
    }

    function configTranslate($translateProvider) {

        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate:        '/js/i18n/{part}/{lang}.json',
            loadFailureHandler: 'errorLoadTranslate'
        });

        $translateProvider.preferredLanguage('es');

        $translateProvider.useSanitizeValueStrategy('escape');
    }

    function configUiRouter($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/');

        var
            getUsuario = [
                '$stateParams', 'pempoResource', '$state', '$rootScope', 'Connect', '$q',
                function($stateParams, pempoResource, $state, $rootScope, Connect, $q){
                return $q(function(resolve, reject){
                    Connect.checkAuthenticated().then(function(isAuthenticated){
                        if(isAuthenticated){
                            var identity = Connect.getIdentity();
                            return pempoResource('usuario').read({id: identity.id}).then(function(usr){
                                $rootScope.usrobj = usr;
                                resolve(usr);
                            });
                        }
                        reject(isAuthenticated);
                    }, function(err){
                        reject(err);
                    })
                });
            }]
        ;

        $stateProvider
            .state('index', {
                url: '/',
                template: getHtml('index'),
                controller: 'IndexCtrl',
                controllerAs: 'index'
            })
            .state('index.lista', {
                url: '/lista-de/{etiqueta}',
                views: {
                    list: {
                        template: getHtml('lista'),
                        controller: 'ListaCtrl',
                        controllerAs: 'lista'
                    }
                }
            })
            .state('index.lista.tarjeta', {
                url: '/empresa/{empresaname}',
                template: getHtml('tarjeta'),
                controller: 'TarjetaCtrl',
                controllerAs: 'tarjeta'
            })
            .state('blog', {
                url: '/blog',
                template: getHtml('blog'),
                controller: 'BlogCtrl',
                controllerAs: 'blog'
            })
            .state('blog.menu', {
                url: '/{menuname}',
                template: getHtml('publicaciones'),
                controller: 'PublicacionesCtrl',
                controllerAs: 'publicaciones'
            })
            .state('blog.menu.submenu', {
                url: '/{submenuname}',
                template: getHtml('publicaciones'),
                controller: 'PublicacionesCtrl',
                controllerAs: 'publicaciones'
            })
            .state('blog.publicacion', {
                url: '/{publicacionname}',
                template: getHtml('publicacion'),
                controller: 'PublicacionCtrl',
                controllerAs: 'publicacion'
            })
            .state('admin', {
                url: '/admin',
                template: getHtml('admin'),
                controller: 'AdminCtrl',
                controllerAs: 'admin'
            })
            .state('admin.resource', {
                url: '/:resourcename',
                template: getHtml('adminresource'),
                controller: 'AdminResourceCtrl',
                controllerAs: 'adminresource'
            })
            .state('admin.resource.edit', {
                url: '/edit/:id',
                template: getHtml('adminedit'),
                controller: 'AdminEditCtrl',
                controllerAs: 'adminedit'
            })
            .state('admin.resource.add', {
                url: '/add',
                template: getHtml('adminedit'),
                controller: 'AdminEditCtrl',
                controllerAs: 'adminedit'
            })
        ;
    }

    function runPempoApp(
        templateCache,
        $rootScope,
        $translate,
        amMoment,
        $state,
        crypto,
        Connect
    ) {
        amMoment.changeLocale('es_CO');

        $translate.refresh();

        $rootScope.$on('$translatePartialLoaderStructureChanged', function () {
            $translate.refresh();
        });


        addPrototype(crypto);

        $rootScope.isAuthenticated = false;
        $rootScope.canonicalizer = function(str){
            return _.kebabCase(_.deburr(str));
        };

        configWatches($rootScope);

        /*$rootScope.$watch('isAuthenticated', function(isAuthenticated_){
            //console.log(isAuthenticated_)
            isAuthenticated = isAuthenticated_;
            if(isAuthenticated && angular.isFunction($rootScope.loadMenu)){
                $rootScope.loadMenu();
            }
        });*/
    }

    function addPrototype(crypto){
        String.prototype.encode = function(key) {
            return crypto.encode(this, true, key);
        };

        String.prototype.decode = function(key) {
            return crypto.decode(this, true, key);
        };

    }

    function getUri(name){
        var urlBase = 'assets/templates/[templateName].html';
        return urlBase.replace('[templateName]',name);
    }

    function getHtml(name){
        var template = JST[getUri(name)];
        if(template){
            return template();
        }
        return '';
    }

    function customSerializer(str){
        //console.log(blog)

        /*if(isAuthenticated && !!str.encode && !!blog && !!blog.nombre){
            console.log(str)
            str = str.encode(blog.nombre);
        }*/
        //console.log(str)
        if(angular.isObject(str)){
            str = JSON.stringify(str);
        }
        return str;
    }

    function customDeserializer(str){
        //console.log(blog)
        /*if(isAuthenticated && !!str.decode && !!blog && !!blog.nombre){
            console.log(str)
            str = str.decode(blog.nombre);
        }*/
        //console.log(str)
        var obj = {};
        try{
            obj = JSON.parse(str);
        }catch(e){
            obj = false;
        }
        if(obj){
            str = obj;
        }
        return str;
    }

    function configWatches($rootScope){
        var watches = {};
        $rootScope.addWatch = addWatch;
        $rootScope.removeWatch = removeWatch;

        function addWatch(functionWatch, functionResponse, name, collection){
            removeWatch(name);
            var watchElemento = null;
            if(collection){
                watchElemento = $rootScope.$watchCollection(functionWatch, function (rta){
                    watches[name] = watchFunc;
                    functionResponse(rta);
                });
            }else{
                watchElemento = $rootScope.$watch(functionWatch, function (rta){
                    watches[name] = watchFunc;
                    functionResponse(rta);
                });
            }
            function watchFunc(){
                watchElemento();
                delete watches[name];
            }
        }

        function removeWatch(name){
            if(!!angular.isFunction(watches[name])){
                watches[name]();
            }
        }
    }

})();
