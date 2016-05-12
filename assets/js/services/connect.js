/**
 * Created by hender on 11/02/16.
 */

(function(){
    'use strict';

    /**
     * @ngdoc service
     * @name SolucionesCucutaApp.Connect
     * @description
     * # Connect
     * Service in the SolucionesCucutaApp.
     */
    angular.module('SolucionesCucutaApp')
        .service('Connect', [
            "$q",
            "$log",
            'pempoLocalStorage',
            '$clientid',
            '$clientsecret',
            '$http',
            '$window',
            '$mdBottomSheet',
            '$rootScope',
            '$timeout',
            'templateCache',
            '$mdMedia',
            '$mdDialog',
            '$mdToast',
            Connect
        ]);

    function Connect(
        $q,
        $log,
        pempoLocalStorage,
        $clientid,
        $clientsecret,
        $http,
        $window,
        $mdBottomSheet,
        $rootScope,
        $timeout,
        templateCache,
        $mdMedia,
        $mdDialog,
        $mdToast
    ) {
        var
            vm              = this,
            socket          = $window.io.socket,
            almacen         = pempoLocalStorage,
            identity        = {},
            AUTH_URL        = 'http://localhost:1337',
            CLIENT_ID       = $clientid,
            CLIENT_SECRET   = $clientsecret,
            captchaData     = {},
            isRegistrar     = false,
            isRecordar      = false,
            onCreated       = {},
            onUpdated       = {},
            onDeleted       = {},
            onChanged       = {},
            isCheck         = false,
            checkFunc       = null
        ;

        setAuthenticated($rootScope.isAuthenticated || false);

        $rootScope.openFilemanager  = openFilemanager;
        $rootScope.openLogin        = openLogin;
        $rootScope.openToast        = openToast;
        $rootScope.openDialog       = openDialog;
        $rootScope.openBottomSheet  = openBottomSheet;

        if(!isAuthenticated()){
            watchToken();
        }else{
            $rootScope.usr = getIdentity();
        }

        function watchToken(){
            $timeout(function(){
                if(!almacen.token){
                    checkAuthenticated().then(function(data){
                        return data
                    }, function (err){
                        console.log(err)
                        watchToken();
                    });
                }
            }, 30 * 1000);
        }

        $rootScope.$on('$pempoResourceCreated', function (event, message) {
            /*
            console.log('=================== CREATED ===================');
            console.log(event);
            console.log(message);
            */
            var model = message.model;
            updatedModel(message.model, false, message.id);
            angular.forEach(message.data, function(val, key){
                if(!!$rootScope.update[key]){
                    updatedModel(key, false, val);
                }
            });
            if (onCreated[model]){
                if(angular.isFunction(onCreated[model]['list'])){
                    onCreated[model]['list'](event, message);
                }
                if(angular.isFunction(onCreated[model][message.id])){
                    onCreated[model][message.id](event, message);
                }
            }
            console.log('=================== CREATED ===================');
        });
        $rootScope.$on('$pempoResourceUpdated', function (event, message) {
            /*
            console.log('=================== UPDATED ===================');
            console.log(event);
            console.log(message);
            */
            //console.log(message);
            var model = message.model;
            updatedModel(message.model, false, message.id);
            angular.forEach(message.data, function(val, key){
                if(!!$rootScope.update[key]){
                    updatedModel(key, false, val);
                }
            });
            if (onUpdated[model]){
                if(angular.isFunction(onUpdated[model]['list'])){
                    onUpdated[model]['list'](event, message);
                }
                if(angular.isFunction(onUpdated[model][message.id])){
                    onUpdated[model][message.id](event, message);
                }
            }
            console.log('=================== UPDATED ===================');
        });
        $rootScope.$on('$pempoResourceDestroyed', function (event, message) {
            /*console.log('=================== DESTROYED ===================');
             console.log(event);
             console.log(message);*/
            var model = message.model;
            updatedModel(message.model, false, message.id);
            if (onDeleted[model]){
                if(angular.isFunction(onDeleted[model]['list'])){
                    onDeleted[model]['list'](event, message);
                }
                if(angular.isFunction(onDeleted[model][message.id])){
                    onDeleted[model][message.id](event, message);
                }
            }
            console.log('=================== DESTROYED ===================');
        });
        $rootScope.$on('$pempoResourceChanged', function (event, message) {
            /*console.log('=================== CHANGED ===================');
             console.log(event);
             console.log(message);*/
            var model = message.model;
            //console.log(model)
            //console.log(onChanged[model])
            if (onChanged[model]){
                if(angular.isFunction(onChanged[model]['list'])){
                    onChanged[model]['list'](event, message);
                }
                if(angular.isFunction(onChanged[model][message.id])){
                    onChanged[model][message.id](event, message);
                }
            }
            console.log('=================== CHANGED ===================');
        });

        $rootScope.$on('$pempoConnected', function (event, message) {
            /*console.log('=================== CONNECTED ===================');
            console.log(event);*/
            $rootScope.connected = true;
            //console.log('=================== CONNECTED ===================');
        });
        $rootScope.$on('$pempoDisconnected', function (event, message) {
            /*console.log('=================== DISCONNECTED ===================');
            console.log(event);*/
            $rootScope.connected = false;
            //console.log('=================== DISCONNECTED ===================');
        });
        $rootScope.$on('$pempoReconnected', function (event, message) {
            /*console.log('=================== RECONNECTED ===================');
            console.log(event);*/
            $rootScope.reconnect = false;
            //console.log('=================== RECONNECTED ===================');
        });
        $rootScope.$on('$pempoReconnecting', function (event, message) {
            /*console.log('=================== RECONNECTING ===================');
            console.log(event);
            console.log(message);*/
            $rootScope.reconnect = {
                time: message.timeDisconnected,
                count: message.reconnectCount
            };
            //console.log('=================== RECONNECTING ===================');
        });
        $rootScope.$on('$pempoError', function (event, message) {
            console.log('=================== ERROR ===================');
            console.log(event);
            console.log(message);
            console.log('=================== ERROR ===================');
        });

        return {
            setOnCreated        : setOnCreated,
            setOnUpdated        : setOnUpdated,
            setOnDeleted        : setOnDeleted,
            setOnChanged        : setOnChanged,
            toggleRegister      : toggleRegister,
            isRegister          : isRegister,
            toggleRememeber     : toggleRemember,
            isRemember          : isRemember,
            getSocket           : getSocket,
            isAuthenticated     : isAuthenticated,
            checkAuthenticated  : checkAuthenticated,
            setAuthenticated    : setAuthenticated,
            infoToken           : infoToken,
            clientToken         : clientToken,
            refreshToken        : refreshToken,
            authenticate        : authenticate,
            loadCaptcha         : loadCaptcha,
            getCaptcha          : getCaptcha,
            register            : register,
            exit                : exit,
            getIdentity         : getIdentity,
            getToken            : getToken,
            openLogin           : openLogin,
            isValidCredentials  : isValidCredentials,
            isUpdatedList       : isUpdatedList,
            setUpdatedList      : setUpdatedList,
            isUpdatedOptions    : isUpdatedOptions,
            setUpdatedOptions   : setUpdatedOptions,
            getIcons            : getIcons,
            getIconsNames       : getIconsNames
        };

        function setOnCreated(model, onCreate, id){
            setOn(onCreated, model, id, onCreate);
        }

        function setOnUpdated(model, onUpdate, id){
            setOn(onUpdated, model, id, onUpdate);
        }

        function setOnDeleted(model, onDelete, id){
            setOn(onDeleted, model, id, onDelete);
        }

        function setOnChanged(model, onChange, id){
            setOn(onChanged, model, id, onChange);
        }

        function setOn(listFunctions, model, id, funcId){
            id = id || 'list';
            if(angular.isFunction(funcId)){
                listFunctions[model] = listFunctions[model] || {};
                listFunctions[model][id]= funcId;
            }
        }

        function toggleRegister(){
            isRegistrar = !isRegistrar;
        }

        function isRegister(){
            return isRegistrar;
        }

        function toggleRemember(){
            isRecordar = !isRecordar;
        }

        function isRemember(){
            return isRecordar;
        }

        function getSocket(){
            return socket;
        }

        function getIcons(iconname){
            if(!angular.isString(iconname)){
                iconname = '';
            }else{
                iconname = '/' + iconname;
            }
            return $q(function(resolve, reject){
                socket.get('/icons' + iconname, function(data){
                    //console.log(data);
                    resolve(data);
                }, function(err){
                    reject(err);
                });
            });
        }

        function getIconsNames(iconname){
            if(!angular.isString(iconname)){
                iconname = '';
            }else{
                iconname = '/' + iconname;
            }
            return $q(function(resolve, reject){
                socket.get('/icons' + iconname,{onlyname: true}, function(data){
                    //console.log(data);
                    resolve(data);
                }, function(err){
                    reject(err);
                });
            });
        }

        function checkAuthenticated(){
            if(!isCheck){
                checkFunc = $q(function(resolve, reject){
                    if(!!almacen.token && !isAuthenticated()){
                        infoToken(function(data){
                            if(!!data){
                                data = data.data || data;
                                infoTokenSuccess(data);
                                resolve(isAuthenticated());
                            }else{
                                if(!!almacen.refresh){
                                    refreshToken().then(function(data){
                                        console.log(data)
                                        resolve(isAuthenticated());
                                    }, reject);
                                }else{
                                    reject(isAuthenticated());
                                }
                            }
                        }, function(err){
                            infoTokenError(err);
                            if(!!almacen.refresh){
                                refreshToken().then(function(data){
                                    console.log(data)
                                    resolve(isAuthenticated());
                                }, reject);
                            }else{
                                reject(err);
                            }
                        });
                    }else{
                        resolve(isAuthenticated())
                    }
                });
            }
            return checkFunc;
        }

        function isAuthenticated(){
            return !!$rootScope.isAuthenticated;
        }

        function setAuthenticated(authorizated){
            $rootScope.isAuthenticated = !!authorizated;
        }

        function validateFunctions(functions){
            var valid = [];
            if(angular.isArray(functions)){
                for(var h = 0 ; h < functions.length ; h++){
                    valid[h] = angular.isFunction(functions[h]);
                }
            }else{
                valid[0] = angular.isFunction(functions);
            }
            return valid;
        }

        function validateSuccessError(success, error){
            var valid = validateFunctions([success, error]);
            if(!valid[0]){
                success = false;
            }
            if(!valid[1]){
                error = false;
            }
        }

        function infoToken(success, error){
            var
                uri = '/oauth/token-info',
                url = AUTH_URL + uri,
                valid = false
            ;

            validateSuccessError(success, error);

            socket.get(
                uri,
                almacen.token?{access_token: almacen.token}:{},
                success || infoTokenSuccess,
                error || infoTokenError);
            /*$http.get(url).then(
                success || infoTokenSuccess,
                error || infoTokenError
            );*/
        }

        function infoTokenSuccess(data) {
            //console.log(data)
            if(data){
                if(data.identity){
                    setIdentity(data.identity);
                }
                if(data.authorization && data.authorization.token){
                    programaticRefresh(data.authorization.token);
                }
            }
        }

        function infoTokenError(err) {
            console.error(err);
            //resetToken();
        }

        /**
         * @function clientToken
         */
        function clientToken(success, error){
            var url = AUTH_URL + '/oauth/token',
                data = {
                    grant_type: 'client_credentials',
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET
                };
            //Clear away previous token, refresh
            resetIdentity();
            //socket.post('/oauth/token', data, authenticateSuccess, authenticateError);
            return $http.post(url, data).then(
                success || clientTokenSuccess,
                error || clientTokenError)
        }

        function clientTokenSuccess(data){
            console.log(data)
            return data;
        }

        function clientTokenError(err){
            return $q.reject(err);
        }

        /**
         * @function refreshToken
         */
        function refreshToken(){
            var url = AUTH_URL + '/oauth/token',
                data = {
                    grant_type: 'refresh_token',
                    client_id: CLIENT_ID,
                    refresh_token: almacen.refresh
                };
            //Clear away previous token, refresh
            //resetIdentity();
            //socket.post('/oauth/token', data, authenticateSuccess, authenticateError);
            return $q(function(resolve, reject){
                almacen.refreshing = almacen.refreshing === 'false'?false:true;
                if(!almacen.refreshing){
                    //resetToken();
                    almacen.refreshing = true;
                    //console.log(url, data)
                    return $http
                        .post(url, data)
                        .then(function(data){
                            //console.log(data)
                            almacen.refreshing = false;
                            return $q.resolve(data.data);
                        }, function(err){
                            almacen.refreshing = false;
                            return $q.reject(err);
                        })
                        .then(authenticateSuccess, authenticateError);
                }else{
                    watchToken();
                }
                //resolve(false);
                //watchToken();
            });
        }

        function isValidCredentials(name, credentials, captcha){
            /*isRecordar  = (!!captcha && !credentials.password2) || isRecordar;
            isRegistrar = (!!captcha && !!credentials.password2) || isRegistrar;*/
            if(!captcha){
                captcha = captchaData;
            }
            var
                alphanumeric = /^[0-9A-Z]+$/i,
                isCap = false
            ;
            if(name === 'login'){
                return (!isRegistrar &&
                    ((!!credentials.username || !!credentials.emailUsername) && !!credentials.password)
                );
            }else{
                isCap = (!!credentials.captcha && credentials.captcha === captcha.code);
            }
            if(name === 'register'){
                return (isCap &&
                    (
                        !!credentials.username && credentials.username.length > 0 &&
                        alphanumeric.test(credentials.username) &&
                        !!credentials.email && credentials.email.length > 0 &&
                        !!credentials.password && credentials.password.length > 0 &&
                        !!credentials.password2 && credentials.password2.length > 0 &&
                        credentials.password === credentials.password2
                    )
                );
            }
            return (isCap && !!credentials.email && credentials.email.length > 0);
            //credentials.valid = valid;
            //return isRec || isReg || isLog;
        }

        function authenticate(credentials) {
            return $q(function(resolve, reject){
                var url = AUTH_URL + '/oauth/token',
                    data = {
                        grant_type: 'password',
                        client_id: CLIENT_ID,
                        username: credentials.username,
                        password: credentials.password
                    };

                //if(isValidCredentials('login', credentials)){
                    resetIdentity();
                    almacen.refreshing = false;
                    //console.log(data)
                    return $http.post(url, data)
                        .success(function(data){
                            authenticateSuccess(data);
                            resolve(true);
                        })
                        .error(function(err){
                            authenticateError(err);
                            reject(err);
                        });
                /*}else{
                    reject({message: 'invalid credentials'});
                }*/
            });
        }

        function authenticateSuccess(data) {
            //console.log(data);
            if(!!data && !!data.access_token && !!data.refresh_token){
                almacen.token = data.access_token;
                almacen.refresh = data.refresh_token;

                /*if(!isAuthenticated()){
                    /!*console.log(almacen.token);
                     console.log(almacen.refresh);*!/
                    //location.reload(true);
                }*/
                if(data.identity){
                    setIdentity(data.identity);
                }else{
                    infoToken();
                }
            }else{
                authenticateError({error: 'invalid_grant'});
            }
        }

        function authenticateError(err) {
            err = err.data || err;
            //console.log(err)
            //resetToken();
            if(err.error === 'invalid_grant'){
                openToast({
                    text: 'Usuario no encontrado',
                    highlight: 'md-warn'
                });
            }
        }

        function getCaptcha(){
            return captchaData;
        }

        function loadCaptcha(){
            var
                uri = '/captcha',
                url = AUTH_URL + uri,
                data = {
                    client_id: CLIENT_ID
                }
                ;
            return $http.get(url).then(captchaSuccess, captchaError);
            /*socket.get(
             uri,
             captchaSuccess,
             captchaError);*/
        }

        function captchaSuccess(captcha){
            captcha = captcha.data;
            //console.log(captcha)
            if(captcha){
                captchaData = captcha;
            }
            return $q.resolve(captcha);
        }

        function captchaError(err){
            //console.log(err)
            resetIdentity();
            return $q.reject(err);
        }

        function register(credentials) {
            return $q(function(resolve, reject){
                var
                    uri = '/usuario/register',
                    url = AUTH_URL + uri,
                    data = credentials
                    ;
                //console.log(credentials)
                //if(isValidCredentials('register', credentials)){
                socket.post(uri, data,
                    function(data){
                        registerSuccess(data);
                        resolve(true);
                    },
                    function(err){
                        registerError(err);
                        reject(err);
                    });
                //}
                /*$http.post(url, data)
                 .success(authenticateSuccess)
                 .error(authenticateError);*/
            });
        }

        function registerSuccess(data){
            openToast({
                text: 'Felicidades!!, solo falta verificar tu email',
                highlight: 'md-primary'
            });
            console.log(data)
        }

        function registerError(err){
            resetToken();
        }

        function programaticRefresh(data){
            //console.log(data.expires_in/60 + 'min para refresh')
            if(data.expires_in){
                $timeout(function(){
                    refreshToken();
                },data.expires_in * 950);
            }
        }

        function setIdentity(user){
            if(user.id){
                identity = user;
                almacen.identity = user;
            }
            setAuthenticated(user && user.id)
        }

        function resetIdentity(){
            identity = {};
            setAuthenticated(false);
        }

        function resetToken(){
            resetIdentity();
            /*delete almacen.refresh;
             delete almacen.token;*/
            almacen.$reset();
        }

        function getIdentity(){
            return identity;
        }

        function getToken(){
            return almacen.token;
        }

        function exit(){
            resetToken();
            location.reload(true);
        }

        function setOpenLogin(isOpenLogin){
            $rootScope.isOpenLogin = !!isOpenLogin;
        }

        function openLogin(){
            var
                //templateName = $mdMedia('gt-sm')?'bottom-sheet':'dialog',
                templateName = 'bottom-sheet',
                data = {
                    controller:          'RegisterloginCtrl',
                    controllerAs:        'registerlogin',
                    templateUrl:         templateName,
                    fullscreen:          $mdMedia('xs'),
                    onShowing:           function(){
                        console.log('open login')
                        setOpenLogin(true);
                    },
                    onRemoving:          function(){
                        console.log('close login')
                        setOpenLogin(false)
                    }
                }
                ;
            //return $mdBottomSheet.show(data);
            return $rootScope.openBottomSheet(data);
        }

        function openToast(msg, config){
            return $q(function(resolve, reject){
                /*var data = {
                    parent:              {}, // element
                    locals:              {}, // vars
                    resolve:             {}, // will not open until the promises resolve
                    autoWrap:            true,
                    position:            'bottom left',
                    hideDelay:           3000,
                    templateUrl:         templateCache.get(''),
                    controller:          '',
                    controllerAs:        '',
                    preserveScope:       false,
                    bindToController:    ''
                }*/
                config                      = config || {};
                config.locals               = config.locals || { msg: msg };
                config.position             = config.position || "top right";
                config.hideDelay            = config.hideDelay || 7000;
                //config.hideDelay            = 0;
                config.templateUrl          = validateTemplateUrl(config.templateUrl, 'toast');
                config.controller           = config.controller || 'ToastCtrl';
                config.controllerAs         = config.controllerAs || 'toast';
                config.preserveScope        = config.preserveScope || false;
                //console.log(config)
                if(config && config.templateUrl){
                    resolve($mdToast.show(config));
                }else{
                    reject('bad config');
                }
            });
        }

        function openDialog(config, msg){
            return $q(function(resolve, reject){
                /*var data = {
                 parent:              {}, // element
                 locals:              {}, // vars
                 resolve:             {}, // will not open until the promises resolve
                 autoWrap:            true,
                 openFrom:            '', // query selector
                 closeTo:             '', // query selector
                 onShowing:           function(){},
                 onRemoving:          function(){},
                 onComplete:          function(){},
                 fullscreen:          function(){},
                 targetEvent:         '',
                 controller:          '',
                 controllerAs:        '',
                 templateUrl:         templateCache.get(''),
                 focusOnOpen:         true,
                 preserveScope:       false,
                 escapeToClose:       true,
                 disableBackdrop:     false,
                 bindToController:    '',
                 clickOutsideToClose: true,
                 disableParentScroll: true,
                 }*/
                config = config || {};
                config.locals               = config.locals || { msg: msg };
                config.onShowing            = config.onShowing || function(){};
                config.onRemoving           = config.onRemoving || function(){};
                config.onComplete           = config.onComplete || function(){};
                config.templateUrl          = validateTemplateUrl(config.templateUrl, 'dialog');
                config.controller           = config.controller || 'DialogCtrl';
                config.controllerAs         = config.controllerAs || 'dialog';
                config.focusOnOpen          = config.focusOnOpen || true;
                config.preserveScope        = config.preserveScope || false;
                config.escapeToClose        = config.escapeToClose || false;
                config.disableBackdrop      = config.disableBackdrop || false;
                config.clickOutsideToClose  = config.clickOutsideToClose || true;
                config.disableParentScroll  = config.disableParentScroll || true;
                /*$rootScope.$watch(
                 function() { return $mdMedia('xs') || $mdMedia('sm');},
                 function(fullScreen) {
                 config.fullScreen = (fullScreen === true);
                 });*/
                console.log(config)
                if(!!config && !!config.templateUrl){
                    resolve($mdDialog.show(config));
                }else{
                    reject('bad config');
                }
            });
        }

        function openFilemanager(config, attrs){
            return $q(function(resolve, reject){
                /*var data = {
                 parent:              {}, // element
                 locals:              {}, // vars
                 resolve:             {}, // will not open until the promises resolve
                 autoWrap:            true,
                 openFrom:            '', // query selector
                 closeTo:             '', // query selector
                 onShowing:           function(){},
                 onRemoving:          function(){},
                 onComplete:          function(){},
                 fullscreen:          function(){},
                 targetEvent:         '',
                 controller:          '',
                 controllerAs:        '',
                 templateUrl:         templateCache.get(''),
                 focusOnOpen:         true,
                 preserveScope:       false,
                 escapeToClose:       true,
                 disableBackdrop:     false,
                 bindToController:    '',
                 clickOutsideToClose: true,
                 disableParentScroll: true,
                 }*/
                if(!attrs.multiple && config.attr){
                    attrs.multiple = config.attr.collection?true:false;
                }
                config                      = config || {};
                config.fullscreen           = config.fullscreen || true;
                config.locals               = config.locals || { attrs: attrs };
                config.onShowing            = config.onShowing || function(){};
                config.onRemoving           = config.onRemoving || function(){};
                config.onComplete           = config.onComplete || function(){};
                config.templateUrl          = validateTemplateUrl(config.templateUrl, 'filemanager');
                config.controller           = 'FilemanagerCtrl';
                config.controllerAs         = 'filemanager';
                config.focusOnOpen          = config.focusOnOpen || true;
                config.preserveScope        = config.preserveScope || false;
                config.escapeToClose        = config.escapeToClose || false;
                config.disableBackdrop      = config.disableBackdrop || false;
                config.clickOutsideToClose  = config.clickOutsideToClose || true;
                config.disableParentScroll  = config.disableParentScroll || true;
                /*$rootScope.addWatch(
                 function() { return $mdMedia('xs') || $mdMedia('sm');},
                 function(fullScreen) {
                 config.fullScreen = (fullScreen === true);
                 },
                 'filemanagerFullscreen'
                 );*/
                /*$rootScope.$watch(
                 function() { return $mdMedia('xs') || $mdMedia('sm');},
                 function(fullScreen) {
                 config.fullScreen = (fullScreen === true);
                 });*/
                //console.log(config)
                if(!!config && !!config.templateUrl){
                    resolve($mdDialog.show(config));
                }else{
                    reject('bad config');
                }
            });
        }

        function openBottomSheet(config){
            return $q(function(resolve, reject){
                /*var data = {
                    parent:              angular.element(),
                    locals:              {}, // vars
                    resolve:             {}, // will not open until the promises resolve
                    controller:          '',
                    controllerAs:        '',
                    templateUrl:         templateCache.get(''),
                    preserveScope:       false,
                    escapeToClose:       true,
                    disableBackdrop:     false,
                    clickOutsideToClose: true,
                    disableParentScroll: true,
                }*/
                config.locals               = config.locals || {};
                /*if(config.controllerAs === 'forms'){
                    config.locals               = angular.merge({templateForm: 'forms'}, config.locals);
                }*/
                config.resolve              = config.resolve || {};
                config.templateUrl          = validateTemplateUrl(config.templateUrl, 'bottom-sheet');
                config.controller           = config.controller || 'BottomSheetCtrl';
                config.controllerAs         = config.controllerAs || 'bottomsheet';
                config.preserveScope        = config.preserveScope || false;
                config.escapeToClose        = config.escapeToClose || true;
                config.disableBackdrop      = config.disableBackdrop || false;
                config.clickOutsideToClose  = config.clickOutsideToClose || true;
                config.disableParentScroll  = config.disableParentScroll || true;
                if(!!config && !!config.templateUrl){
                    resolve($mdBottomSheet.show(config).then(function(){
                        //console.log('BottomSheetHide')
                        config.locals.resource.resourceData.$editing = false;
                    }, function(){
                        //console.log('BottomSheetCancel')
                        if(config.locals.resource.resourceData){
                            config.locals.resource.resourceData.$editing = false;
                        }
                    }));
                }else{
                    reject('Bad config');
                }
            });
        }

        function validateTemplateUrl(templateUrl, defaultTemplateUrl){
            //console.log(templateUrl)
            if(angular.isString(defaultTemplateUrl)){
                if(angular.isString(templateUrl)){
                    templateUrl = templateCache.get(templateUrl);
                }else{
                    templateUrl = templateCache.get(defaultTemplateUrl);
                }
            }else{
                templateUrl = null;
            }
            //console.log(templateUrl)
            return templateUrl;
        }

        function isUpdatedOptions(model){
            $rootScope.update[model]  = $rootScope.update[model] || {};
            return $rootScope.update[model].options;
        }

        function setUpdatedOptions(model, updated){
            $rootScope.update[model]  = $rootScope.update[model] || {};
            $rootScope.update[model].options = !!updated;
        }

        function isUpdatedList(model){
            $rootScope.update[model]  = $rootScope.update[model] || {};
            return $rootScope.update[model].list;
        }

        function setUpdatedList(model, updated){
            $rootScope.update[model]  = $rootScope.update[model] || {};
            $rootScope.update[model].list = !!updated;
        }

        function updatedModel(model, updated, id){
            setUpdatedOptions(model, updated);
            setUpdatedList(model, updated);
            /*if(id){
             $rootScope.update[model][id]
             }*/
        }
    }

})();
