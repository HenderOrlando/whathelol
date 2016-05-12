/**
 * Created by hender on 11/02/16.
 */

(function(){
    'use strict';

    /**
     * @ngdoc function
     * @name SolucionesCucutaApp.controller:HtmlHeadCtrl
     * @description
     * # HtmlHeadCtrl
     * Controller of the SolucionesCucutaApp
     */
    angular.module('SolucionesCucutaApp')
        .controller('HtmlHeadCtrl', [
            "$rootScope",
            "templateCache",
            "$translatePartialLoader",
            "Connect",
            "pempoLocalStorage",
            "$mdMedia",
            HtmlHeadCtrl
        ]);

    function HtmlHeadCtrl(
        $rootScope,
        templateCache,
        $translatePartialLoader,
        Connect,
        pempoLocalStorage,
        $mdMedia
    ) {

        $translatePartialLoader.addPart('htmlhead');

        var
            almacen = pempoLocalStorage,
            vm      = this
            ;
        vm.titleApp = 'Soluciones Cúcuta';

        $rootScope.changeTitlePempoApp = changeTitlePempoApp;
        $rootScope.templateLogin = templateCache.get('login');
        $rootScope.mdMedia = $mdMedia;

        if(almacen.token){
            Connect.checkAuthenticated();
        }

        function changeTitlePempoApp(
            usrobj,
            perfilobj,
            menuobj,
            menuname,
            submenuname
        ){
            //vm.titleApp = title + '-' + titleNew;
            //vm.titleApp = titleNew;
            var indexmenu = -1,
                indexsubmenu = -1,
                title = ''
                ;
            /*console.error(appobj,
                usrobj,
                perfilobj,
                menuobj,
                menuname,
                submenuname)*/
            if(menuname){
                indexmenu = $rootScope.getIndexMenuPerfil(menuname);
                //indexmenu = $rootScope.indexMenu || -1;
            }
            if(submenuname){
                indexsubmenu = $rootScope.getIndexMenuPerfil(submenuname, true);
                //indexsubmenu = $rootScope.indexSubmenu || -1;
            }
            title =
                // usuario
                (!!usrobj && !!usrobj.username?' -> ' + _.capitalize(usrobj.username):'') +
                    // publicaciones
                (!!perfilobj && !!perfilobj.nombre?' -> ' + _.capitalize(perfilobj.nombre):'') +
                    // menu
                (indexmenu > -1 && !!menuobj && !!menuobj[indexmenu]?' -> ' + _.capitalize(menuobj[indexmenu].nombreplural):'') +
                    // submenu
                (indexmenu > -1 && indexsubmenu > -1 && !!menuobj && !!menuobj[indexmenu] && menuobj[indexmenu].submenu && !!menuobj[indexmenu].submenu[indexsubmenu]?' -> ' + _.capitalize(menuobj[indexmenu].submenu[indexsubmenu].nombreplural):'')
            ;
            vm.titleApp = title;
        }
    }
})();
