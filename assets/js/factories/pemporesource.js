/**
 * Created by hender on 11/02/16.
 */

(function(){
    'use strict';

    /**
     * @ngdoc service
     * @name SolucionesCucutaApp.pempoResource
     * @description
     * # pempoResource
     * Factory in the SolucionesCucutaApp.
     */
    angular.module('SolucionesCucutaApp')
        .factory('pempoResource', [
            '$q',
            '$timeout',
            '$rootScope',
            'pempoSocketResource',
            'pempoLocalStorage',
            'Connect',
            pempoResource
        ]);

    function pempoResource(
        $q,
        $timeout,
        $rootScope,
        pempoSocketResource,
        pempoLocalStorage,
        Connect

) {
        var
            storage = pempoLocalStorage,
            url = 'http://localhost:1337/',
            socket = Connect.getSocket(),
            opts = function(){ return {access_token: storage.token};}
            ;
        return function(resourceName){
            var
                Elemento = {},
                list = [],
                filterList = [],
                xhrCreations   = 0,
                xhrResolutions = 0,
                params = {}
                ;
            try{
                //console.log(resourceName);
                Elemento = pempoSocketResource(resourceName, {
                    /*'addItem':      {method: 'PUT', url: '/addItem/:modelname/:modelid/:associationname/:associationid'},
                    'removeItem':   {method: 'PUT', url: '/removeItem/:modelname/:modelid/:associationname/:associationid'},*/
                    'populate':     {method: 'GET', url: '/populateItem/:modelname/:id/:populate'},
                    'hateoas':      {method: 'GET', url: '/hateoas/' + resourceName, isArray: true},
                    'params':      {method: 'GET', url: '/params/' + resourceName, isArray: false}
                }, opts());
                /*Elemento.query().$promise.then(function(list_){
                    list = list_;
                });*/
            }catch (e){
                console.error(e);
                throw "Resource not found.";
            }

            return {
                "create"  : createElemento, // Create Element
                "read"    : readElemento,   // Return One Element
                "update"  : updateElemento, // Update Element
                "delete"  : deleteElemento, // Delete Element
                //"filter"  : filterElemento, // Use Query for search. Return  List Element
                "filter"  : filterElemento, // Use Query for search. Return  List Element
                "find"    : findElemento,   // Use Get for search. Return One Element
                "query"   : queryElemento, // Return List Element
                "model"   : modelElemento,
                "form"    : formElemento,
                "menuAdmin": menuAdminElemento,
                "list"    : listElemento,
                "hateoas" : getHateoas,
                "populate": populateElemento,
                /*"add"     : Elemento.addItem,
                "remove"  : Elemento.removeItem*/
                "add"     : addElemento,
                "remove"  : subElemento
            };

            function createElemento(elemento){
                xhrCreations++;
                updateStatus();
                var def = $q.defer();

                if(angular.isFunction(elemento.$save)){
                    console.log(elemento)
                    elemento.$save(function (el) {
                        //console.log(el)
                        def.resolve(el);
                    }, function(e){
                        def.reject(e);
                    });
                }else{
                    def.reject('Resource is not valid.');
                }

                return def.promise.then(function(res){
                    logAllways(false, 'create', res);
                    return $q.resolve(res);
                }, function(e){
                    logAllways(true, 'create', e);
                    return $q.reject(e);
                });
            }

            function readElemento(criteria){
                return $q(function(resolve, reject){
                    Elemento.get(angular.merge(criteria), resolve, reject);
                });
            }

            function addElemento(criteria){
                return $q(function(resolve, reject){
                    Elemento.add(criteria, resolve, reject);
                });
            }

            function subElemento(criteria){
                return $q(function(resolve, reject){
                    Elemento.sub(criteria, resolve, reject);
                });
            }

            function updateElemento(newElemento){
                xhrCreations++;
                updateStatus();
                var
                    def = $q.defer(),
                    list = [],
                    keys = Object.keys(newElemento),
                    val = null
                ;
                //newElemento = angular.merge(modelElemento(), newElemento);
                $timeout(function(){
                    if(angular.isFunction(newElemento.$save) && newElemento.id){
                        var url_ = url + resourceName + '/' + newElemento.id;
                        //var url_ = url + 'update/' + resourceName + '/' + newElemento.id;
                        /*console.log(url_);
                        $http.put(url_, newElemento.toJSON())
                            .then(function(res){
                                console.log(res);
                                def.resolve(res);
                            }, function(err){
                                def.reject(err);
                            })
                        ;*/
                        /*socket.request({
                            method: 'PUT',
                            url: '/update/' + resourceName + '/' + newElemento.id,
                            data: newElemento.toJSON(),
                            headers: {
                                authorization: 'Bearer ' + opts.access_token
                            }
                        }, function(resData, response){
                            if(resData && resData.id){
                                def.resolve(resData);
                            }else{
                                def.reject(resData);
                            }
                        });*/
                        /*if(params){
                            console.log(params)
                            var i, id;
                            angular.forEach(params, function(val, key){
                                if(val.model && val.through && val.via){
                                    for(i = 0; i < newElemento[key].length; i++){
                                        id = newElemento[key][i];
                                        newElemento[key][i] = {};
                                        newElemento[key][i][val.model] = id;
                                        newElemento[key][i][val.via] = newElemento.id;
                                    }
                                }
                            });
                        }*/
                        //console.log(newElemento)
                        newElemento.$save(function (el) {
                            console.log(el)
                            def.resolve(el);
                        }, function(e){
                            console.log(e)
                            def.reject(e);
                        });
                    }else{
                        def.reject('Resource is not valid.');
                    }
                }, 50);

                return def.promise.then(function(res){
                    logAllways(false, 'update', res);
                    return $q.resolve(res);
                }, function(e){
                    logAllways(true, 'update', e);
                    return $q.reject(e);
                });
            }

            function deleteElemento(elemento){
                xhrCreations++;
                updateStatus();
                var def = $q.defer();
                //elemento = angular.merge(modelElemento(), elemento);
                $timeout(function(){
                    if(angular.isFunction(elemento.$delete)){
                        elemento.$delete(function (el) {
                            console.log(el)
                            def.resolve(el);
                        }, function(e){
                            console.log(e)
                            def.reject(e);
                        });
                    }else{
                        def.reject('Resource is not valid.');
                    }
                }, 50);

                return def.promise.then(function(res){
                    logAllways(false, 'delete', res);
                    return $q.resolve(res);
                }, function(e){
                    logAllways(true, 'delete', e);
                    return $q.reject(e);
                });
            }

            function filterElemento(query){
                return selectElemento(query, true);
            }

            function findElemento(query){
                return selectElemento(query, false);
            }

            function selectElemento(query, filter){
                xhrCreations++;
                updateStatus();
                var def = $q.defer();

                if(angular.isObject(query)){
                    var result = [];
                    if(filter){
                        result = Elemento.query(query);
                    }else{
                        result = Elemento.get(query);
                    }
                    def.resolve(result);
                }else{
                    def.reject('Query is not valid.');
                }

                return def.promise.then(function(res){
                    logAllways(false, filter?'filter':'find', res);
                    return $q.resolve(res);
                }, function(e){
                    logAllways(true, filter?'filter':'find', e);
                    return $q.reject(e);
                });
            }

            function queryElemento(criteria){
                return $q(function(resolve, reject){
                    Elemento.query(criteria, resolve, reject);
                });
            }

            function logAllways(error, method, rej){
                xhrResolutions++;
                updateStatus();
                if(error){
                    var title = '----- ' + method.toUpperCase() + ' ' + (error?'REJECT':'SUCCESS') + ' -----';
                    console.log(title);
                    console.error(rej);
                    console.log(title);
                }
            }

            function modelElemento(){
                return new Elemento();
            }

            function formElemento(){
                return $q(function(resolve, reject){
                    socket.get('/params/'+resourceName, opts(), function (data) {
                        //console.log(data)
                        if(data.attrs){
                            resolve(data.attrs);
                        }else{
                            reject(data);
                        }
                        /*Connect.setAuthenticated(data && !!data.configadmin);
                        if(data && data.configadmin){
                            params = data.configadmin.attrs;
                            resolve(params);
                        }else{
                            reject(data);
                        }*/
                    });
                });
            }

            function menuAdminElemento(){
                return $q(function(resolve, reject){
                    socket.get('/params', opts(), function (data) {
                        //console.log(data)
                        Connect.setAuthenticated(!!data);
                        if(data){
                            resolve(data);
                        }else{
                            reject(data);
                        }
                    });
                });
            }

            function isLoading() {
                return xhrResolutions < xhrCreations;
            }

            function updateStatus() {
                $rootScope.loading = isLoading();
            }

            function listElemento(query){
                return Elemento.query(query || {}).$promise.then(function(data){
                    Connect.setUpdatedList(resourceName, true);
                    return $q.resolve(data);
                });
            }

            function getHateoas(query){
                return Elemento.hateoas(query || {}).$promise.then(function(data){
                    //console.log(data);
                    //Connect.setUpdatedList(resourceName, true);
                    return $q.resolve(data);
                });
            }

            function populateElemento(elemento, attr){
                return Elemento.populate({
                    modelname: resourceName,
                    id: elemento.id,
                    populate: attr || 'all'
                });
                /*socket.request({
                    method: 'get',
                    url: '/populate/' + resourceName + '/' + elemento.id + (attr || 'all'),
                    headers: {
                        authorization: 'Bearer ' + opts.access_token
                    }
                }, function(resData, response){
                    if(resData && resData.id){
                        console.log(resData)
                        console.log(response)
                        def.resolve(resData);
                    }else{
                        def.reject(resData);
                    }
                });*/
            }

            /*function elementoAdd(queryopts){
                var def = $q.defer();

                $timeout(function(){
                    Elemento.add(queryopts);
                }, 50);

                return def.promise.then(function(res){
                    logAllways(false, 'create', res);
                    return $q.resolve(res);
                }, function(e){
                    logAllways(true, 'create', e);
                    return $q.reject(e);
                });
            }

            function elementoRemove(queryopts){
                var def = $q.defer();

                $timeout(function(){
                    console.log(queryopts)
                    Elemento.remove(queryopts);
                }, 50);

                return def.promise.then(function(res){
                    logAllways(false, 'create', res);
                    return $q.resolve(res);
                }, function(e){
                    logAllways(true, 'create', e);
                    return $q.reject(e);
                });
            }*/

            /*

             Create Error


            function causeError (){
                Elemento.notFound(
                    function (response) {
                    },
                    function (response) {
                        vm.error = response.statusCode;
                    });
            }

            Example On Event

            $rootScope.$on('$sailsResourceCreated', function (event, message) {
                console.log('=================== CREATED ===================');
                console.log(message);
                if(message.model == 'elemento') {
                    //vm.elementos.push();
                }
            });
            $rootScope.$on('$sailsResourceUpdated', function (event, message) {
                console.log('=================== UPDATED ===================');
                console.log(message);
                if(message.model == 'elemento') {
                    //vm.elementos.push();
                }
            });
            $rootScope.$on('$sailsResourceDestroyed', function (event, message) {
                console.log('=================== DESTROYED ===================');
                console.log(message);
                if(message.model == 'elemento') {
                    //vm.elementos.push();
                }
            });
            */
        };
    }

})();
