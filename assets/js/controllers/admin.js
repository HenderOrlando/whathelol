/**
 * Created by hender on 11/02/16.
 */

(function(){
    'use strict';

    /**
     * @ngdoc function
     * @name SolucionesCucutaApp.controller:AdminCtrl
     * @description
     * # AdminCtrl
     * Controller of the SolucionesCucutaApp
     */
    angular.module('SolucionesCucutaApp')
        .controller('AdminCtrl', [
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
            '$mdSidenav',
            'Connect',
            '$q',
            '$timeout',
            '$log',
            AdminCtrl]);

    function AdminCtrl(
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
        $mdSidenav,
        Connect,
        $q,
        $timeout,
        $log
    ) {
        //console.log('AdminCtrl');

        /*Connect.checkAuthenticated().then(function(isAuthenticated){
            console.log('isAuthenticated', isAuthenticated)
            if(isAuthenticated){
                $log.log('OK')
            }else{
                $log.error('BAD')
            }
        });*/

        $translatePartialLoader.addPart('admin');

        var
            almacen     = pempoLocalStorage,
            vm          = this,
            identity    = Connect.getIdentity(),
            host        = $location.host(),
            path        = $location.path(),
            Usuario     = pempoResource('usuario'),
            Rol         = pempoResource('rol'),
            usr         = null
        ;

        checkUserApp();

        $rootScope.getMenuAdmin = getMenu;
        $rootScope.menuactual = {};

        vm.toggleSidenav = toggleSidenav;
        vm.isOpenSidenav = isOpenSidenav;
        vm.salir  = Connect.exit;
        vm.menus  = getMenu();
        vm.getIconMenu  = getIconMenu;
        vm.login = {
            action: login,
            model: {},
            nombre: 'login',
            button: {
                label: 'entrar'
            },
            fields: {
                /*email: {
                    type: 'text',
                    label: 'email'
                },*/
                username: {
                    type: 'text',
                    label: 'username'
                },
                password: {
                    type: 'password',
                    label: 'password'
                }
            }
        };
        vm.search          = {
            label:  'buscar recurso',
            filter: filterQuery,
            query:  '',
            button: {
                label:  'buscar'/*,
                 icon:   'magnify'*/
            }
        };

        function toggleSidenav(id){
            getSidenav(id).toggle();
        }

        function isOpenSidenav(id){
            return getSidenav(id).isOpen();
        }

        function getSidenav(id){
            return $mdSidenav(id);
        }

        function login(){
            var validate = isValidLogin();
            if(validate.isValid()){
                Connect.authenticate(vm.login.model).then(function(isAuthenticated){
                    vm.isAuthenticated = isAuthenticated;
                }, function(err){
                    //console.error(err);
                });
            }else{
                var msg = 'Falta el ';
                if(!validate.isValidUsername() && !validate.isValidPassword()){
                    msg += 'username y el password ';
                }else if(!validate.isValidPassword()){
                    msg += 'password ';
                }else{
                    msg += 'username';
                }
                $rootScope.openToast(msg);
            }
        }

        function isValidLogin(){
            var
                isValidUsername = function isValidUsername(model){
                    model = model || vm.login.model;
                    return model.username && model.username.length;
                },
                isValidPassword = function isValidPassword(model){
                    model = model || vm.login.model;
                    return model.password && model.password.length;
                },
                isValid = function isValid(model){
                    model = model || vm.login.model;
                    return model && isValidUsername(model) && isValidPassword(model)
                }
            ;
            return {
                isValid: isValid,
                isValidUsername: isValidUsername,
                isValidPassword: isValidPassword
            };
        }

        function checkUserApp(){
            return $q(function(resolve, reject){
                if(almacen.token && !usr){
                    Connect.checkAuthenticated().then(function(isAuthenticated){
                        vm.isAuthenticated = isAuthenticated;
                        if(isAuthenticated){
                            identity        = Connect.getIdentity();
                            Usuario.read({id: identity.id}).then(function(user){
                                usr = user;
                                //console.log(usr);
                                resolve(usr);
                            });
                        }else{
                            reject(isAuthenticated);
                        }
                    }, reject);
                }
                vm.isAuthenticated = Connect.isAuthenticated();
                resolve(usr)
            });
        }

        function filterQuery(item, index,list){
            var found = true;
            if(!_.isEmpty(vm.search.query) && angular.isString(vm.search.query)){
                //console.log(item)
                var
                    canonicalPlural = _.kebabCase(_.deburr(item.plural)),
                    querycanonical = _.kebabCase(_.deburr(vm.search.query)),
                    canonical = _.kebabCase(_.deburr(item.nombre))
                ;
                found =
                    canonical.indexOf(querycanonical) > -1 ||
                    canonicalPlural.indexOf(querycanonical) > -1
                ;
            }
            return found;
        }

        function getIconMenu(menuname){
            var
                icon = 'menu',
                menu = vm.menus.filter(function(menu){
                    return menu.nombre === menuname || menu.nombre === menuname
                })
            ;
            if(menu.length && menu[0].icon){
                icon = menu[0].icon;
            }
            return icon;
        }

        function getMenu(){
            return [
                {
                    nombre: 'archivo',
                    model: 'archivo',
                    plural: 'archivos',
                    icon:   'file',
                    descripcion: 'archivos guardados'
                },
                {
                    nombre: 'estado',
                    model: 'estado',
                    plural: 'estados',
                    icon:   'radiobox-marked',
                    descripcion: 'estados disponibles'
                },
                {
                    nombre: 'etiqueta',
                    model: 'etiqueta',
                    plural: 'etiquetas',
                    icon:   'tag',
                    descripcion: 'etiquetas disponibles'
                },
                {
                    nombre: 'gasto',
                    model: 'gasto',
                    plural: 'gastos',
                    icon:   'store',
                    descripcion: 'gastos realizados (egresos)'
                },
                {
                    nombre: 'menu',
                    model: 'menu',
                    plural: 'menus',
                    icon:   'format-line-weight',
                    descripcion: 'menús creados'
                },
                {
                    nombre: 'pagina',
                    model: 'pagina',
                    plural: 'paginas',
                    icon:   'view-day',
                    descripcion: 'páginas creadas'
                },
                {
                    nombre: 'pago',
                    model: 'pago',
                    plural: 'pagos',
                    icon:   'currency-usd',
                    descripcion: 'pagos recibidos (ingresos)'
                },
                {
                    nombre: 'permiso',
                    model: 'permiso',
                    plural: 'permisos',
                    icon:   'key',
                    descripcion: 'permisos disponibles'
                },
                {
                    nombre: 'publicacion',
                    model: 'publicacion',
                    plural: 'publicaciones',
                    icon:   'newspaper',
                    descripcion: 'publicaciones realizadas'
                },
                {
                    nombre: 'rol',
                    model: 'rol',
                    plural: 'roles',
                    icon:   'check-all',
                    descripcion: 'roles disponibles'
                },
                {
                    nombre: 'servicio',
                    model: 'servicio',
                    plural: 'servicios',
                    icon:   'briefcase',
                    descripcion: 'servicios registrados'
                },
                {
                    nombre: 'tipo',
                    model: 'tipo',
                    plural: 'tipos',
                    icon:   'bookmark',
                    descripcion: 'tipos disponibles'
                },
                {
                    nombre: 'usuario',
                    model: 'usuario',
                    plural: 'usuarios',
                    icon:   'account',
                    descripcion: 'usuarios registrados'
                },
                {
                    nombre: 'servicios de usuario',
                    model: 'serviciousuario',
                    plural: 'servicios de usuarios',
                    icon:   'ticket-account',
                    descripcion: 'servicios de los usuarios'
                }
            ]
        }
    }
})();
