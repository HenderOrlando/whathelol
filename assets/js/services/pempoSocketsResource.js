/**
 * Created by hender on 23/03/16.
 */
(function (angular) {

    var forEach = angular.forEach,
        copy = angular.copy,
        extend = angular.extend,
        isObject = angular.isObject,
        isArray = angular.isArray,
        isString = angular.isString,
        isFunction = angular.isFunction;

    angular.module('SolucionesCucutaApp')
        .provider('pempoSocketResource', function () {

        var DEFAULT_CONFIGURATION = {
            // Set a route prefix, such as '/api'
            prefix: '',
            // When verbose, socket updates go to the console
            verbose: false,
            // Set a specific websocket
            socket: null,
            // Set a specific origin
            origin: null,
            // Set resource primary key
            primaryKey: 'id',
            // Access Token
            access_token: null
        };

        this.configuration = {};

        this.$get = ['$rootScope', '$window', '$log', '$q', function ($rootScope, $window, $log, $q) {
            var config = extend({}, DEFAULT_CONFIGURATION, this.configuration);
            return resourceFactory($rootScope, $window, $log, $q, config);
        }];
    });

    function resourceFactory($rootScope, $window, $log, $q, config) {

        var DEFAULT_ACTIONS = {
            'get':      {method: 'GET'},
            'save':     {method: 'POST'},
            'query':    {method: 'GET', isArray: true},
            'remove':   {method: 'DELETE'},
            'delete':   {method: 'DELETE'},
            'add':      {method: 'POST', url: '/:model/:id/:association/:fk'},
            'sub':      {method: 'DELETE', url: '/:model/:id/:association/:fk'}
        };

        var MESSAGES = {
            // Resource
            changed: '$pempoResourceChanged',
            created: '$pempoResourceCreated',
            updated: '$pempoResourceUpdated',
            destroyed: '$pempoResourceDestroyed',
            messaged: '$pempoResourceMessaged',
            addedTo : '$pempoResourceAddedTo',
            removedFrom : '$pempoResourceRemovedFrom',


            // Socket
            connected: '$pempoConnected',
            disconnected: '$pempoDisconnected',
            reconnected: '$pempoReconnected',
            reconnecting: '$pempoReconnecting',
            socketError: '$pempoError'
        };

        var CALLS = {};

        return function (model, actions, options) {
            if (typeof model != 'string' || model.length == 0) {
                throw 'Model name is required';
            }
            //usar cache
            $rootScope.cache  = $rootScope.cache || {};
            $rootScope.update  = $rootScope.update || {};
            $rootScope.update[model]  = $rootScope.update[model] || {};
            $rootScope.update[model].options = $rootScope.update[model].options || false;
            $rootScope.update[model].list = $rootScope.update[model].list || false;

            model = model.toLowerCase(); // Sails always sends models lowercase
            actions = extend({}, DEFAULT_ACTIONS, actions);
            options = extend({}, config, options);
            var data = {}; // datos extra en consultas
            if(options.access_token){
                data = {access_token: options.access_token};
            }

            // Ensure prefix starts with forward slash
            if (options.prefix && options.prefix.charAt(0) != '/') {
                options.prefix = '/' + options.prefix;
            }


            // Create our socket instance based on options

            var socket;
            if(options.socket) { // Was given to us
                socket = options.socket;
            }
            else if(options.origin) { // A custom origin
                socket = $window.io.sails.connect(options.origin);
            }
            else { // Default: use base socket
                socket = $window.io.socket;
            }

            // Setup socket default messages

            socket.on('connect', function () {
                $rootScope.$apply(function () {
                    $rootScope.$broadcast(MESSAGES.connected);
                });
            });

            socket.on('disconnect', function () {
                $rootScope.$apply(function () {
                    $rootScope.$broadcast(MESSAGES.disconnected);
                });
            });

            socket.on('reconnect', function () {
                $rootScope.$apply(function () {
                    $rootScope.$broadcast(MESSAGES.reconnected);
                });
            });

            socket.on('reconnecting', function (timeDisconnected, reconnectCount) {
                $rootScope.$apply(function () {
                    $rootScope.$broadcast(MESSAGES.reconnecting, {
                        timeDisconnected: timeDisconnected,
                        reconnectCount: reconnectCount
                    });
                });
            });

            socket.on('error', function (error) {
                $rootScope.$apply(function () {
                    $rootScope.$broadcast(MESSAGES.socketError, error);
                });
            });

            // Disconnect socket when window unloads
            $window.onbeforeunload = function () {
                if (socket) {
                    socket.disconnect();
                }
            };

            // Caching
            var cache = {};
            // TODO implement cache clearing?

            function removeFromCache(id) {
                delete cache[id];
                // remove this item in all known lists
                forEach(cache, function (cacheItem) {
                    if (isArray(cacheItem)) {
                        var foundIndex = null;
                        forEach(cacheItem, function (item, index) {
                            if (item[options.primaryKey] == id) {
                                foundIndex = index;
                            }
                        });
                        if (foundIndex != null) {
                            cacheItem.splice(foundIndex, 1);
                        }
                    }
                });
            }

            // Resource constructor
            function Resource(value) {
                copy(value || {}, this);
            }

            function mergeParams(params, actionParams) {
                return extend({}, actionParams || {}, params || {});
            }

            // Handle a request
            // Does a small amount of preparation of data and directs to the appropriate request handler
            function handleRequest(item, params, action, success, error) {

                // When params is a function, it's actually a callback and no params were provided
                if (isFunction(params)) {
                    error = success;
                    success = params;
                    params = {};
                }


                var instanceParams,
                    actionParams = action && typeof action.params === 'object' ? action.params : {};
                if (action.method == 'GET') {

                    instanceParams = mergeParams(params, actionParams);

                    // Do not cache if:
                    // 1) action is set to cache=false (the default is true) OR
                    // 2) action uses a custom url (Sails only sends updates to ids) OR
                    // 3) the resource is an individual item without an id (Sails only sends updates to ids)

                    if (!action.cache || action.url || (!action.isArray && (!instanceParams || !instanceParams[options.primaryKey]))) { // uncached
                        item = action.isArray ? [] : new Resource();
                    }
                    else {
                        // cache key is 1) stringified params for lists or 2) id for individual items
                        var key = action.isArray ? JSON.stringify(instanceParams || {}) : instanceParams[options.primaryKey];
                        // pull out of cache if available, otherwise create new instance
                        item = cache[key] || (action.isArray ? []
                                // Set key on object using options.primaryKey
                                : (function(){ var tmp = {}; tmp[options.primaryKey] = key; return new Resource(tmp) })());
                        cache[key] = item; // store item in cache
                    }

                    return retrieveResource(item, instanceParams, action, success, error);
                }
                else {
                    // When we have no item, params is assumed to be the item data
                    if (!item) {
                        item = new Resource(params);
                        params = {};
                    }

                    instanceParams = mergeParams(params, actionParams);

                    if (action.method == 'POST' || action.method == 'PUT') { // Update individual instance of model
                        return createOrUpdateResource(item, instanceParams, action, success, error);
                    }
                    else if (action.method == 'DELETE') { // Delete individual instance of model
                        return deleteResource(item, instanceParams, action, success, error);
                    }
                }
            }

            // Handle a response
            function handleResponse(item, response, action, deferred, delegate) {
                var body = response.body;
                action = action || {};
                $rootScope.$apply(function () {
                    item.$resolved = true;
                    /*console.log(item)
                    console.log(action)
                    console.log(response)*/
                    if (response && (response.statusCode >= 400 || response.status >= 400)){
                        response.headers.url = item.$retrieveUrl;
                        $log.error(response);
                        deferred.reject(response, item, body);
                    }
                    else if (!isArray(item) && isArray(body) && body.length != 1) {
                        // This scenario occurs when GET is done without an id and Sails returns an array. Since the cached
                        // item is not an array, only one item should be found or an error is thrown.
                        var errorMessage = (body.length ? 'Multiple' : 'No') +
                            ' items found while performing GET on a singular \'' + model + '\' Resource; did you mean to do a query?';

                        $log.error(errorMessage);
                        deferred.reject(errorMessage, item, body);
                    }
                    else {
                        // converting single array to single item
                        if (!isArray(item) && isArray(body)) body = body[0];

                        if (isArray(action.transformResponse)) {
                            forEach(action.transformResponse, function(transformResponse) {
                                if (isFunction(transformResponse)) {
                                    body = transformResponse(body);
                                }
                            })
                        }
                        if (isFunction(action.transformResponse)) body = action.transformResponse(body);
                        if (isFunction(delegate)) delegate(body);

                        // 1) Internally resolve with both item and header getter
                        // for pass'em to explicit success handler
                        // 2) In attachPromise() cut off header getter, so that
                        // implicit success handlers receive only item
                        item.$headers = response.headers;
                        deferred.resolve({
                            item: item,
                            getHeaderFn: function(name) { return jwr && jwr.headers && jwr.headers[name]; }
                        });
                    }
                });
            }

            function attachPromise(item, success, error) {
                var deferred = $q.defer();
                item.$promise = deferred.promise.then(function(result) {
                    // Like in ngResource explicit success handler
                    // (passed directly as an argument of action call)
                    // receives two arguments:
                    // 1) item and 2) header getter function.
                    (success || angular.noop)(result.item, result.getHeaderFn);

                    // Implicit success handlers (bound via Promise API, .then())
                    // receive only item argument
                    return $q.when(result.item);
                });
                item.$promise.catch(error);
                item.$resolved = false;
                return deferred;
            }

            // Request handler function for GETs
            function retrieveResource(item, params, action, success, error) {
                var deferred = attachPromise(item, success, error);

                var url = buildUrl(model, params ? params[options.primaryKey] : null, action, params, options);
                item.$retrieveUrl = url;

                if (options.verbose) {
                    $log.info('pempoResource calling GET ' + url);
                }
                //url = 'populate' + url + '/all';
                var requestOpt = {
                    method: 'GET',
                    url: url
                };
                if(options.access_token){
                    requestOpt.headers = {};
                    requestOpt.headers.authorization = 'Bearer ' + options.access_token;
                }
                if(!CALLS[url]){ // Evita múltiples llamados al mismo modelo por la misma ruta
                    CALLS[url] = item;
                    setTimeout(function(){
                        //console.log(url);
                        delete CALLS[url];
                    }, 2 * 1000);
                    if($rootScope.update && $rootScope.update[model] && $rootScope.update[model].list){ // datos temporales
                        if(!_.isEmpty($rootScope.cache[model])){
                            if(item && item.id){
                                var tmp = $rootScope.cache[model].filter(function(it){
                                    return it.id === item.id;
                                });
                                if(tmp.length > 0){
                                    return tmp[0];
                                }
                            }else{
                                return $rootScope.cache[model];
                            }
                        }
                    }
                    //console.log(model);
                    // Contextos que están relacionados
                    /*var contextos = [
                            'blog',
                            'menu',
                            'contexto',
                            'estado',
                            'etiqueta',
                            'marco',
                            'permiso',
                            'rol',
                            'tipo',
                            'usuario',
                            'menu'
                        ],
                        addNombre = function(item){
                            if(!item.nombre) {
                                item.nombre = '';
                                contextos.filter(function (cont) {
                                    if (!!item[cont]) {
                                        item.nombre += (item[cont].nombre || item[cont]) + ' - ';
                                    }
                                    return !!item[cont];
                                });
                            }
                        }
                    ;*/
                    var request = socket.request(requestOpt, function(resData, response){
                        //console.log(resData)
                        handleResponse(item, response, action, deferred, function (data) {
                            if (isArray(item)) { // empty the list and update with returned data
                                while (item.length) item.pop();
                                forEach(data, function (responseItem) {
                                    responseItem = new Resource(responseItem);
                                    responseItem.$updated = false;
                                    responseItem.$resolved = true;
                                    //addNombre(responseItem);
                                    item.push(responseItem); // update list
                                });
                                $rootScope.cache[model] = item;
                                //console.log(item)
                            }
                            else {
                                extend(item, data); // update item
                                if(!item.$populated && item.$retrieveUrl.indexOf('/populate') > -1){
                                    item.$populated = true
                                }
                                //addNombre(item);
                                //console.log(item)
                                // If item is not in the cache based on its id, add it now
                                if (!cache[ item[ options.primaryKey ] ]) {
                                    cache[ item[ options.primaryKey ] ] = item;
                                }
                                if(!$rootScope.cache[model]){
                                    $rootScope.cache[model] = {};
                                }
                                if(!$rootScope.cache[model][ item[ options.primaryKey ] ]){
                                    item.$updated = false;
                                    $rootScope.cache[model][ item [ options.primaryKey ] ] = item;
                                }
                            }
                        });
                    });
                }else{
                    //console.log(model);
                    return CALLS[url];
                }
                return item;
            }

            // Request handler function for PUTs and POSTs
            function createOrUpdateResource(item, params, action, success, error) {
                var deferred = attachPromise(item, success, error);

                // prep data
                var transformedData;
                if (isFunction(action.transformRequest)) {
                    var tmp = action.transformRequest(item);
                    transformedData = typeof tmp === 'object' ? tmp : JSON.parse(tmp);
                }

                // prevents prototype functions being sent
                var data = copyAndClear(transformedData || item, {});
                var url = buildUrl(model, data[options.primaryKey], action, params, options);

                // when Resource has id use PUT, otherwise use POST
                var method = 'post';
                //console.log(params)
                if(!params.association && item[options.primaryKey]){
                    method = 'put';
                    //url = '/update' + url;
                    angular.forEach(data, function(val, key){
                        if(angular.isArray(val)){
                            delete data[key];
                        }
                    });
                }else{
                    method = action.method.toLowerCase();
                    data.access_token = options.access_token;
                }
                //var method = item[options.primaryKey] ? 'put' : 'post';
                //console.log(data)
                if (options.verbose) {
                    $log.info('pempoResource calling ' + method.toUpperCase() + ' ' + url);
                }
                var requestOpt = {
                    method: method,
                    url:    url,
                    data:   data
                };
                if(options.access_token && !data.access_token){
                    requestOpt.headers = {};
                    requestOpt.headers.authorization = 'Bearer ' + options.access_token;
                    //data.access_token = options.access_token;
                }
                console.log(requestOpt)
                //socket[method](url, data, function (resData, response) {
                socket.request(requestOpt, function(resData, response){
                    /*console.log(resData)
                    console.log(response)*/
                    handleResponse(item, response, action, deferred, function (data) {
                        extend(item, data);

                        var message = {
                            model: model,
                            data: item
                        };
                        message[options.primaryKey] = item[options.primaryKey];

                        if(!$rootScope.cache[model]){
                            $rootScope.cache[model] = {};
                        }
                        if(method === 'put'){
                            item.$updated = true;
                        }
                        if (method === 'put' || params.association) {
                            // Update cache
                            socketUpdateResource(message);
                            // Emit event
                            $rootScope.$broadcast(MESSAGES.updated, message);
                            message.type = 'updated';
                            $rootScope.$broadcast(MESSAGES.changed, message);
                        } else {
                            // Update cache
                            socketCreateResource(message);
                            // Emit event
                            $rootScope.$broadcast(MESSAGES.created, message);
                            message.type = 'created';
                            $rootScope.$broadcast(MESSAGES.changed, message);
                        }
                    });
                });

                return item.$promise;
            }

            // Request handler function for DELETEs
            function deleteResource(item, params, action, success, error) {
                var deferred = attachPromise(item, success, error);
                var url = buildUrl(model, item[options.primaryKey], action, params, options);

                if (options.verbose) {
                    $log.info('pempoResource calling DELETE ' + url);
                }
                //url = '/delete' + url;
                socket.delete(url, (!options.access_token?{}:{access_token: options.access_token}), function (resData, response) {
                    //console.log(resData, response)
                    handleResponse(item, response, action, deferred, function () {
                        removeFromCache(item[options.primaryKey]);
                        var tmp = {model: model};
                        tmp[options.primaryKey] = item[options.primaryKey];
                        $rootScope.$broadcast(MESSAGES.destroyed, tmp);
                        tmp.type = 'destroyed';
                        $rootScope.$broadcast(MESSAGES.changed, tmp);
                        // leave local instance unmodified
                    });
                });

                return item.$promise;
            }

            function socketUpdateResource(message) {
                forEach(cache, function (cacheItem, key) {
                    if (isArray(cacheItem)) {
                        forEach(cacheItem, function (item) {
                            if (item[options.primaryKey] == message[options.primaryKey]) {
                                if (needsPopulate(message.data, item)) { // go to server for updated data
                                    var tmp = {};
                                    tmp[options.primaryKey] = item[options.primaryKey];
                                    retrieveResource(item, tmp);
                                }
                                else {
                                    extend(item, message.data);
                                }
                            }
                        });
                    }
                    else if (key == message[options.primaryKey]) {
                        if (needsPopulate(message.data, cacheItem)) { // go to server for updated data
                            var tmp = {};
                            tmp[options.primaryKey] = cacheItem[options.primaryKey];
                            retrieveResource(cacheItem, tmp);
                        }
                        else {
                            extend(cacheItem, message.data);
                        }
                    }
                });
            }

            function socketCreateResource(message) {
                cache[message[options.primaryKey]] = new Resource(message.data);
                // when a new item is created we have no way of knowing if it belongs in a cached list,
                // this necessitates doing a server fetch on all known lists
                // TODO does this make sense?
                forEach(cache, function (cacheItem, key) {
                    if (isArray(cacheItem)) {
                        retrieveResource(cacheItem, JSON.parse(key));
                    }
                });
            }

            function socketDeleteResource(message) {
                removeFromCache(message[options.primaryKey]);
            }

            // Add each action to the Resource and/or its prototype
            forEach(actions, function (action, name) {
                // fill in default action options
                action = extend({}, {cache: true, isArray: false}, action);

                function actionMethod(params, success, error) {
                    var self = this;
                    if (action.fetchAfterReconnect) {
                        // let angular-resource-sails refetch important data after
                        // a server disconnect then reconnect happens
                        socket.on('reconnect', function () {
                            handleRequest(isObject(self) ? self : null, params, action, success, error);
                        });
                    }

                    return handleRequest(isObject(this) ? this : null, params, action, success, error);
                }

                if (/^(POST|PUT|PATCH|DELETE)$/i.test(action.method)) {
                    // Add to instance methods to prototype with $ prefix, GET methods not included
                    Resource.prototype['$' + name] = actionMethod;
                }

                // All method types added to service without $ prefix
                Resource[name] = actionMethod;
            });

            // Handy function for converting a Resource into plain JSON data
            Resource.prototype.toJSON = function() {
                var data = extend({}, this);
                delete data.$promise;
                delete data.$resolved;
                delete data.$populated;
                delete data.$updated;
                return data;
            };

            // Subscribe to changes
            socket.on(model, function (message) {
                if (options.verbose) {
                    $log.info('pempoResource received \'' + model + '\' message: ', message);
                }
                //console.log(message)
                var messageName = null, type = '';
                $rootScope.$apply(function () {
                    switch (message.verb) {
                        case 'updated':
                            socketUpdateResource(message);
                            messageName = MESSAGES.updated;
                            type = 'updated';
                            break;
                        case 'created':
                            socketCreateResource(message);
                            messageName = MESSAGES.created;
                            type = 'created';
                            break;
                        case 'destroyed':
                            socketDeleteResource(message);
                            messageName = MESSAGES.destroyed;
                            type = 'destroyed';
                            break;
                        case 'messaged':
                            messageName = MESSAGES.messaged;
                            break;
                        case 'addedTo' :
                            messageName = MESSAGES.addedTo;
                            type = 'addTo';
                            break;
                        case 'removedFrom' :
                            messageName = MESSAGES.removedFrom;
                            type = 'removeFrom';
                            break;
                    }
                    $rootScope.$broadcast(messageName, extend({model: model}, message));
                    $rootScope.$broadcast(MESSAGES.changed, extend({model: model, type: type}, message));
                });
            });

            return Resource;
        };
    }

    /**
     * As of Sails 0.10.4 models with associations will not be populated in socket update data. This function detects
     * this scenario, i.e. the dst[key] (current value) is an object, but the src[key] (updated value) is an id.
     * Ideally this function will stop returning true if/when Sails addresses this issue as both dst and src will
     * contain an object.
     */
    function needsPopulate(src, dst) {
        for (var key in src) {
            if (src.hasOwnProperty(key) && isObject(dst[key]) && !isObject(src[key])) {
                return true;
            }
        }
        return false;
    }

    /**
     * Deep copies and removes view properties
     */
    function copyAndClear(src, dst) {
        dst = dst || (isArray(src) ? [] : {});

        forEach(dst, function (value, key) {
            delete dst[key];
        });
        for (var key in src) {
            if (src.hasOwnProperty(key) && key.charAt(0) !== '$' && !isFunction(src[key])) {
                var prop = src[key];
                dst[key] = isObject(prop) ? copyAndClear(prop) : prop;
            }
        }

        return dst;
    }

    /**
     * Builds a sails URL!
     */
    function buildUrl(model, id, action, params, options) {
        var url = [];
        var urlParams = {};
        /*console.log(action)
        console.log(params)*/
        if (action && action.url) {
            var actionUrl = action.url;

            // Look for :params in url and replace with params we have
            var matches = action.url.match(/(:\w+)/g);
            if (matches) {
                forEach(matches, function (match) {
                    var paramName = match.replace(':', '');
                    if (paramName === options.primaryKey) {
                        actionUrl = actionUrl.replace(match, id);
                    } else if(paramName === 'model'){
                        actionUrl = actionUrl.replace(match, model);
                    } else {
                        urlParams[paramName] = true;
                        actionUrl = actionUrl.replace(match, params[paramName]);
                    }
                });
            }

            url.push(actionUrl);
        }
        else {
            url.push(options.prefix);
            url.push('/');
            url.push(model);
            if (id) url.push('/' + id);
        }
        //console.log(url)

        var queryParams = {};
        angular.forEach(params, function(value, key) {
            if (!urlParams[key]) {
                queryParams[key] = value;
            }
        });

        url.push(createQueryString(queryParams, options));
        return url.join('');
    }

    /**
     * Create a query-string out of a set of parameters, similar to way AngularJS does (as of 1.3.15)
     * @see https://github.com/angular/angular.js/commit/6c8464ad14dd308349f632245c1a064c9aae242a#diff-748e0a1e1a7db3458d5f95d59d7e16c9L1142
     */
    function createQueryString(params) {
        if (!params) { return ''; }

        var parts = [];
        Object.keys(params).sort().forEach(function(key) {
            var value = params[key];
            if (key === 'id') { return; }
            if (value === null || value === undefined) { return; }
            if (!Array.isArray(value)) { value = [value]; }
            value.forEach(function(v) {
                if (angular.isObject(v)) {
                    v = angular.isDate(v) ? v.toISOString() : angular.toJson(v);
                }
                parts.push(key + '=' + v);
            });
        });
        return parts.length ? '?' + parts.join('&') : '';
    }


})(window.angular);
