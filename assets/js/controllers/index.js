/**
 * Created by hender on 11/02/16.
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
        .controller('IndexCtrl', [
            "$rootScope",
            "$mdMedia",
            "$translatePartialLoader",
            "pempoLocalStorage",
            "pempoResource",
            '$state',
            '$mdToast',
            '$mdDialog',
            '$mdBottomSheet',
            'templateCache',
            '$clientid',
            '$clientsecret',
            '$location',
            'Connect',
            '$q',
            '$timeout',
            '$log',
            IndexCtrl]);

    function IndexCtrl(
        $rootScope,
        $mdMedia,
        $translatePartialLoader,
        pempoLocalStorage,
        pempoResource,
        $state,
        $mdToast,
        $mdDialog,
        $mdBottomSheet,
        templateCache,
        $clientid,
        $clientsecret,
        $location,
        Connect,
        $q,
        $timeout,
        $log
    ) {
        console.log('IndexCtrl');

        /*Connect.checkAuthenticated().then(function(isAuthenticated){
            console.log('isAuthenticated', isAuthenticated)
            if(isAuthenticated){
                $log.log('OK')
            }else{
                $log.error('BAD')
            }
        });*/

        $translatePartialLoader.addPart('index');

        var
            almacen         = pempoLocalStorage,
            vm              = this,
            identity        = {},
            host            = $location.host(),
            path            = $location.path(),
            watches         = {},
            Menu            = pempoResource('menu'),
            Publicacion     = pempoResource('publicacion'),
            Usuario         = pempoResource('usuario'),
            menuDirectorio  = []
        ;

        Menu.filter({
            // Menú Directorio
            tipo: '5717e66041201db50a61b484'
        }).then(function(rta){
            rta.$promise.then(function(menus){
                // quitar al crear el tipo de menu directorio
                menus = menus.filter(function(menu, key){
                    return menu.nombre.toLowerCase() === 'empresas'
                });
                menuDirectorio = menus[0];
                vm.menu = menuDirectorio && menuDirectorio.submenu;
            });
        });

        /*Publicacion.filter({
            // Usuario Súper Admin
            usuario: '5716eb93a3580a9f4fb63cf9',
            // Publicación Principal
            tipo: '5718bd248b3eb386310287c1',
            // Publicado
            estado: '5718cb7930af6e38379cb4c0'
        }).then(function(publicaciones){
            //console.log(publicaciones)
            vm.publicaciones = publicaciones;
        });*/

        Usuario.filter({
            // Rol Empresa
            rol: '5717e66041201db50a61b484'
        }).then(function(empresas){
            console.log(empresas)
            vm.empresas = empresas;
        });

        // Initialize Credentials
        //$rootScope.theme            = $rootScope.theme || 'solucionescucuta';
        $rootScope.exit             = Connect.exit;
        $rootScope.getIdentity      = Connect.getIdentity;
        $rootScope.isAuthenticated  = Connect.isAuthenticated();
        $rootScope.template         = templateCache;

        //vm.templateLogin    = templateCache.get('login');
        vm.search          = {
            label:  'que estás buscando?',
            filter: filterQuery,
            query:  '',
            button: {
                label:  'buscar'/*,
                icon:   'magnify'*/
            }
        };

        vm.isState          = isState;
        vm.isAdmin          = isAdmin;
        vm.credentials      = {
            /*email:      '',
            username:   '',
            password:   '',
            password2:  ''*/
        };
        vm.register     = Connect.register;
        //vm.checkEmail   = Connect.infoToken;
        vm.captchaData  = {};
        vm.authenticate = authenticated;

        vm.images = [
            {
                src: 'images/cover.jpg',
                title: 'Soluciones Cúcuta'
            },
            {
                src: 'images/cover-cian.jpg',
                title: 'Soluciones Cúcuta'
            },
            {
                src: 'images/cover-grey.jpg',
                title: 'Soluciones Cúcuta'
            },
            {
                src: 'images/cover-magenta.jpg',
                title: 'Soluciones Cúcuta'
            }
        ];

        $rootScope.$watchCollection(function(){return vm.credentials}, Connect.isValidCredentials);

        //console.log($location);

        almacen.$sync();

        //Connect.checkAuthenticated();
        $rootScope.$on('$viewContentLoading', function(event, viewConfig){
            // Access to all the view config properties.
            // and one special property 'targetView'
            // viewConfig.targetView
            //Connect.checkAuthenticated();
            $rootScope.loading = false;
        });
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams, options){
                $rootScope.loading = true;
            });

        function filterQuery(item, index,list){
            var found = true;
            if(!_.isEmpty(vm.search.query) && angular.isString(vm.search.query)){
                //console.log(item)
                var querycanonical = _.kebabCase(_.deburr(vm.search.query));
                found = item.canonical.indexOf(querycanonical) > -1;
            }
            return found;
        }

        function authenticated(){
            Connect.authenticate(vm.credentials);
        }

        function isValid(){
            return Connect.isValidCredentials(vm.credentials, vm.captchaData);
        }

        function isState(statename, params, opts){
            var isState = false;
            opts = opts || {};
            params = params || {};
            if(angular.isString(statename)){
                isState = $state.is(statename, params, opts);
            }
            return isState;
        }

        function isAdmin(){
            return isState('index.admin');
        }
    }
})();
