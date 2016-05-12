/**
 * Created by hender on 11/02/16.
 */

(function(){
    'use strict';

    /**
     * @ngdoc function
     * @name SolucionesCucutaApp.controller:AdminResourceCtrl
     * @description
     * # AdminResourceCtrl
     * Controller of the SolucionesCucutaApp
     */
    angular.module('SolucionesCucutaApp')
        .controller('AdminResourceCtrl', [
            "$rootScope",
            "$mdMedia",
            "$translatePartialLoader",
            "pempoLocalStorage",
            "pempoResource",
            '$state',
            '$stateParams',
            '$mdToast',
            '$mdDialog',
            '$mdBottomSheet',
            'templateCache',
            '$clientid',
            '$clientsecret',
            '$location',
            'Connect',
            '$q',
            '$mdEditDialog',
            '$timeout',
            '$element',
            '$filter',
            '$log',
            AdminResourceCtrl]);

    function AdminResourceCtrl(
        $rootScope,
        $mdMedia,
        $translatePartialLoader,
        pempoLocalStorage,
        pempoResource,
        $state,
        $stateParams,
        $mdToast,
        $mdDialog,
        $mdBottomSheet,
        templateCache,
        $clientid,
        $clientsecret,
        $location,
        Connect,
        $q,
        $mdEditDialog,
        $timeout,
        $element,
        $filter,
        $log
    ) {
        //console.log('AdminResourceCtrl');

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
            almacen         = pempoLocalStorage,
            resource        = $stateParams.resourcename,
            vm              = this,
            identity        = {},
            host            = $location.host(),
            path            = $location.path(),
            Resource        = null,
            busyResource    = false,
            forceGetResource= true,
            watches         = [],
            tmp             = {}
        ;

        if(!resource){
            $state.go('admin');
            $rootScope.openToast({
                text: 'Recurso no válido'
            });
        }else{
            vm.getDateHumanized = getDateHumanized;
            vm.getSetDate = getSetDate;
            vm.needSave = needSave;
            vm.deleteResource = deleteResource;
            vm.saveResource = saveResource;
            vm.editResource = editResource;
            vm.isCollection = isCollection;
            vm.showListData = showListData;
            vm.submitQuery = submitQuery;
            vm.addResource = addResource;
            vm.isRelation = isRelation;
            vm.isNumeric = isNumeric;
            vm.isString = isString;
            vm.totalResource = 0;
            vm.isDate = isDate;
            vm.promise = null;
            vm.count = 0;
            vm.attrs = {};
            vm.keys = false;
            vm.selected = [];
            vm.options = {};
            vm.labelpagination = {
                page: 'Página:',
                rowsPerPage: 'Filas por página:',
                of: 'de'
            };
            vm.query = {
                button: {
                    label:  'buscar',
                    icon:   'magnify'
                },
                label:  'buscar',
                order: 'nombre',
                limit: 10,
                page: 1,
                model: '',
                filter: filterQuery
            };
            vm.updateResource = updateResource;
            vm.loadOptions = loadOptions;
            vm.checkChange = checkChange;
            vm.search = {};

            vm.menu = $rootScope.getMenuAdmin().filter(function(val){
                return val.nombre === resource;
            })[0];

            $rootScope.menuactual = vm.menu;
            /*console.log(path)
            console.log(path.indexOf('add') < 0)
            console.log(path.indexOf('edit'))
            console.log(path.indexOf('edit') < 0 && path.indexOf('add') < 0)*/
            if(path.indexOf('edit') < 0 && path.indexOf('add') < 0){
                //console.log($location)
                Connect.setOnChanged(resource, function(event, message){
                    var
                        attr = vm.attrs[message.attribute],
                        index = -1
                        ;
                    console.log(message)
                    if(message.type === 'created'){
                        $rootScope.openToast({
                            text: 'Se ha creado "' + message.data.nombre + '"',
                            link: {
                                text: 'recargar',
                                onClick: function($event){
                                    forceGetResource = true;
                                    getResources();
                                }
                            }
                        });
                    }else{
                        var item = vm.list.filter(function(i, key){
                            if(i.id === message.id){
                                index = key;
                            }
                            return i.id === message.id;
                        });
                        //console.log(item);
                        if(item.length){
                            item = item[0];
                            if(item[message.attribute]){
                                $rootScope.openToast({
                                    text: 'Se ha modificado "' + item.nombre + '"',
                                    link: {
                                        text: 'recargar',
                                        onClick: function($event){
                                            forceGetResource = true;
                                            getResources();
                                        }
                                    }
                                });
                                /*if(message.type === 'removeFrom'){
                                    // Is collection
                                    if(item[message.attribute] && _.isArray(item[message.attribute])){
                                        item[message.attribute] = item[message.attribute].filter(function(val){
                                            var id = val.id || val;
                                            return id !== message.removedId;
                                        });
                                        reloadItem(item);
                                    }
                                }else if(message.type === 'addTo'){
                                    if(item[message.attribute] && _.isArray(item[message.attribute])){
                                        pempoResource(attr.model || attr.collection).read({ id: message.addedId }).then(function(item_){
                                            item[message.attribute] = item[message.attribute] || [];
                                            item[message.attribute].push(item_);
                                            reloadItem(item);
                                        }, function(err){

                                        })
                                    }
                                }*/
                            }
                        }
                    }
                    function reloadItem(item){
                        var index = -1;
                        for(var h = 0; h < vm.list.length; h++){
                            if(vm.list[h].id === message.id){
                                index = h;
                                break;
                            }
                        }
                        console.log(index)
                        if(index >= 0){
                            $timeout(function(){
                                vm.list = vm.list.splice(index,1,item);
                            }, 50)
                        }
                        /*vm.list = vm.list.filter(function(val){
                            return item.id !== val.id;
                        });
                        $timeout(function(){
                            vm.list.push(item);
                        }, 50);*/
                    }
                });
            }

            Resource = pempoResource(resource);
            Resource.form().then(function (form){
                vm.attrs = form;
                vm.keys = Object.keys(form);
                loadOptions();
                /*
                console.log(forms)
                console.log(vm.keys)
                */
            });
            vm.resource = resource;
            vm.query.label = 'buscar ' + resource;
            vm.reloadList = function($event){
                forceGetResource = true;
                getResources();
            };
            getResources();
        }
        $rootScope.addWatch(function(){ return vm.query; }, function(){
            forceGetResource = true;
        }, 'watchQuery', true);

        function loadOptions (key, obj){
            var keys = Object.keys(vm.attrs);
            $element.find('md-select-header > input').on('keydown', function(e){
                //e.preventDefault();
                e.stopPropagation();
            });
            return $q(function(resolve, reject){
                var opts = [];
                if(key){
                    opts.push(loadOptionsKey(key));
                }else{
                    for(var h = 0; h < keys.length; h++){
                        opts.push(loadOptionsKey(keys[h]));
                    }
                }
                $q.all(opts).then(resolve, reject);
            });
            function loadOptionsKey(key){
                return $q(function(resolve, reject){
                    var attr = vm.attrs[key];
                    vm.search[key] = {
                        model: '',
                        label: 'que ' + key + ' buscas?',
                        filter: filterOption
                    };
                    if(obj){
                        // Guarda temporal de los datos originales
                        tmp[obj.id] = tmp[obj.id] || {};
                        if(!tmp[obj.id][key]){
                            tmp[obj.id][key] = obj[key];
                        }
                    }
                    //if(!vm.options[key]){
                        if(attr.enum){
                            resolve(attr.enum);
                        }else if(attr.model || attr.collection){
                            vm.options[key] = [];
                            var
                                listDe = ['estado', 'tipo'],
                                Model = pempoResource(attr.model || attr.collection),
                                criteria = {
                                    limit: 50,
                                    skip: 0/*,
                                     where: {
                                     contains: vm.query.model
                                     }*/
                                }
                                ;
                            if(key === 'serviciousuario'){
                                criteria.populate = true;
                            }
                            if(attr.model){
                                if(listDe.indexOf(attr.model) > -1){
                                    criteria.where = {};
                                    criteria.where[attr.model + 'De'] = resource === 'serviciousuario'?'usuario':resource;
                                }
                                Model.hateoas(criteria).then(function(options){
                                    /*var metainfo = options.$headers.metainfo;
                                     if(metainfo.total > criteria.limit){
                                     // volver a cargar con el total
                                     }*/
                                    resolve(options)
                                }, reject);
                            }else{
                                Model.hateoas(criteria).then(function(options){
                                    /*var metainfo = options.$headers.metainfo;
                                     if(metainfo.total > criteria.limit){
                                     // volver a cargar con el total
                                     }*/
                                    //console.log(options)
                                    resolve(options);
                                }, reject);
                            }
                        }
                    //}
                }).then(function(list){
                    var attrsNombres = [
                        'username',
                        'servicio',
                        'rol',
                        'usuario',
                        'estado'
                    ];
                    list = list.map(function(item){
                        if(_.isObject(item) && !item.nombre){
                            item.nombre = '';
                            var addChar = false, char = ' - ';
                            for(var h = 0; h < attrsNombres.length; h++){
                                addChar = item.nombre.length > 0;
                                if(item[attrsNombres[h]]){
                                    if(item[attrsNombres[h]].nombre){
                                        item.nombre += (addChar?char:'') + item[attrsNombres[h]].nombre;
                                    }else{
                                        item.nombre += (addChar?char:'') + item[attrsNombres[h]];
                                    }
                                }
                            }
                        }
                        return item;
                    });
                    vm.options[key] = list;
                    return list;
                });

                function filterOption(item, index, list){
                    var found = true, search = '';
                    if(!_.isEmpty(vm.search[key].model) && angular.isString(vm.search[key].model)){
                        found = false;
                        search = norm(vm.search[key].model);
                        if(_.isObject(item)){
                            var opts = ['nombre', 'descripcion', 'detalles'];
                            for(var h = 0; h < opts.length; h++){
                                if(_.isString(item[opts[h]])){
                                    found = found || norm(item[opts[h]]).indexOf(search) > -1;
                                }
                            }
                        }else {
                            found = norm(item).indexOf(search) > -1;
                        }
                    }
                    return found;
                    function norm(str){
                        return _.kebabCase(_.deburr(str));
                    }
                }
            }
        }

        function checkChange(key, resource){
            // Revisa cambios de los datos originales, guardados en tmp
            tmp[resource.id] = tmp[resource.id] || {};
            var
                updated = false,
                val = tmp[resource.id][key]
            ;
            if(val && val.id){
                val = val.id;
            }

            resource.$updated = resource.$updated || {};

            if(vm.attrs[key].type){
                updated = tmp[key] !== resource[key];
            }else if(vm.attrs[key].model && resource[key]){
                updated = val !== resource[key];
                if(resource[key] && resource[key].id){
                    updated = val !== resource[key].id;
                }
            }else if(vm.attrs[key].collection){
                val = val && val.length?val.length:0;
                updated = resource[key] && resource[key].length?val !== resource[key].length:false;
            }
            resource.$updated[key] = updated;
        }

        function updateResource($event, resource, field){
            if(isRelation(resource, key)){
                $event.preventDefault();
                $event.stopPropagation();
            }else if(isString(resource, field)){
                //$event.preventDefault();
                $event.stopPropagation();

                var
                    isResource = false,
                    title = (isResource?'Edita':'Agrega') + ' ' +  field,
                    //template = templateCache.getHtml('inputdatatable'),
                    editDialog = {
                        modelValue: resource[field],
                        placeholder: field,
                        save: function(input){
                            /*if(input.$modelValue){
                                input.$invalid = true;
                                return $q.reject();
                            }*/
                            resource[field] = input.$modelValue;
                            resource.$updated = resource.$updated || {};
                            resource.$updated[field] = true;
                            vm.selected.push(resource);
                        },
                        targetEvent: $event,
                        title: title,
                        validators: {},
                        //template: template,
                        type: getTypeInput(field),
                        cancel: 'cancelar',
                        ok: 'Guardar'
                    }
                ;
                /*if(vm.attrs[field].type === 'text'){
                    editDialog.template = templateCache.getHtml('textareadatatable');
                }*/
                if(vm.attrs[field].maxlength && vm.attrs[field].maxlength > 0){
                    editDialog.validators = {
                        'md-maxlength': vm.attrs[field].maxlength
                    };
                }
                var promise;
                if($mdMedia('gt-sm')){
                    promise = $mdEditDialog.large(editDialog);
                }else{
                    promise = $mdEditDialog.small(editDialog);
                }
                //$mdEditDialog.show(editDialog);

                promise.then(function (ctrl){
                    var input = ctrl.getInput();

                    input.$viewChangeListeners.push(function(){
                        input.$setValidity()
                    });
                });
            }

            function getTypeInput(key){
                var type = 'text';
                if(isString(null, key)){
                    if(vm.attrs[key].type === 'text'){
                        type = 'textarea';
                    }
                }else if(isNumeric(null, key)){
                    type = 'number'
                }
                return type;
            }
        }

        function needSave(){
            var need = false;
            //console.log(vm.selected)
            for(var h = 0; h < vm.selected.length && !need; h++){
                need = needSaveResource(vm.selected[h]);
            }
            return need;
        }

        function needSaveResource(resource){
            var need = false, keys = [];
            if(resource.$updated){
                keys = Object.keys(resource.$updated);
                for(var h = 0; h < keys.length && !need; h++){
                    need = need || resource.$updated[keys[h]];
                }
            }
            return need;
        }

        function deleteResource (){
            //console.log(vm.selected)
            for(var h = 0; h < vm.selected.length; h++){
                deleteSelect(h);
            }
            function deleteSelect(h){
                var select = vm.selected[h], id = vm.selected[h].id;
                //console.log(select)
                select.$delete(function(el){
                    console.log(el)
                    vm.selected = vm.selected.filter(function(val){
                        return val.id !== id
                    });
                    //vm.selected = vm.selected.splice(h, 1);
                    vm.list = vm.list.filter(function(item){
                        return select.id !== item.id;
                    });
                    select.$updated = {};
                }, function(err){
                    $log.error(err);
                });
            }
        }

        function saveResource (){
            //console.log(vm.selected)
            for(var h = 0; h < vm.selected.length; h++){
                if(needSaveResource(vm.selected[h])){
                    saveSelect(h);
                }
            }
            function saveSelect(h){
                var select = angular.copy(vm.selected[h]);
                console.log(select)
                angular.forEach(select, function(val, key){
                    if(val && val.id){
                        select[key] = val.id;
                    }
                });
                select.$save(function(el){
                    //console.log(el)
                    //vm.selected.splice(h, 1);
                    select.$updated = {};
                    tmp[select.id] = angular.copy(vm.selected[h]);
                    vm.selected = vm.selected.filter(function(val){
                        return val.id !== select.id;
                    });
                }, function(err){
                    $log.error(err);
                });
            }
        }

        function editResource(){
            //$rootScope.listEdit = vm.selected;
            if(vm.selected.length === 1){
                $state.go('admin.resource.edit', {id: vm.selected[0].id });
            }else{
                // open slected
            }
        }

        function addResource (){
            console.log('Add Resource ' + resource)
        }

        function submitQuery(){
            getResources();
        }

        function getResourcesSuccess(filtered){
            //console.log('getResourcesSuccess')
            //console.log(filtered)
            vm.count = filtered.$headers.metainfo.total;
            if(!vm.totalResource){
                vm.totalResource = vm.count;
            }
            vm.list = filtered;

            vm.list = vm.list.map(function(item){

                if(item.valor){
                    item.valor = $filter('currency')(item.valor, '$');
                }
                /*if(vm.attrs[key].type === 'float'){

                }*/
                return item;
            });

            busyResource = false;
            /*var rsc = filtered[0];
            if(rsc){
                vm.keys = Object.keys(rsc).filter(function(key){
                    return key.indexOf('$') < 0;
                });
                vm.keys = vm.keys.map(function(key){
                    if(key === 'size'){
                        key += '(bytes)';
                    }
                    return key;
                });
            }*/
        }

        function createQueryLanguage(){
            var
                desc = vm.query.order.indexOf('-') > -1,
                where = getWhere(),
                or = getOr(),
                ql = {
                    populate: true,
                    sort: vm.query.order + ' ' + (desc?'DESC':'ASC'),
                    limit: vm.query.limit,
                    skip: (vm.query.page * vm.query.limit) - vm.query.limit
                }
            ;
            if(Object.keys(where).length){
                //ql.where = where;
                ql.or = [or];
            }
            return ql;
            function getWhere(){
                var where = {};
                if(vm.query.model && vm.query.model.length){
                    angular.forEach(vm.attrs, function(attr, key){
                        if(attr.type && attr.type === 'string' || attr.type === 'text'){
                            where[key] = {
                                contains: vm.query.model
                            };
                        }
                    });
                }
                return where;
            }
            function getOr(){
                var or = [], obj = {};
                if(vm.query.model && vm.query.model.length){
                    angular.forEach(vm.attrs, function(attr, key){
                        if(attr.type && attr.type === 'string' || attr.type === 'text'){
                            obj = {};
                            obj[key] = {
                                contains: vm.query.model
                            };
                            or.push(obj);
                        }
                    });
                }
                return or;
            }
        }

        function getResources(){
            /*console.log('getResources')
            console.log(vm.query)
            console.log('getResources')*/
            if(forceGetResource && !busyResource){
                busyResource = true;
                forceGetResource = false;
                vm.promise = Resource.hateoas(createQueryLanguage()).then(getResourcesSuccess);
            }
        }

        function isCollection(data, key){
            return vm.attrs[key].collection /*&& vm.attrs[key].dominant*/;
        }

        function isRelation(data, key){
            var
                model   = vm.attrs[key] && vm.attrs[key].model,
                isEnum  = vm.attrs[key] && vm.attrs[key].enum
            ;
            return model || isEnum;
        }

        function isString(data, key){
            var type = vm.attrs[key].type;
            return type && (type === 'string' || type === 'text' || type === 'email') && !vm.attrs[key].enum;
        }

        function isNumeric(data, key){
            var type = vm.attrs[key].type;
            return type && (type === 'integer' || type === 'float' || type === 'int');
        }

        function isDate(data, key){
            var type = key.type;
            if(_.isString(key)){
                type = vm.attrs[key].type;
            }
            return type && (type === 'date' || type === 'datetime' || type === 'time');
        }

        function getDateHumanized(date, key){
            //console.log(date)
            if(isDate(date, key)){
                date = new Date(date);
                //console.log(moment(date))
                return moment(date).format("LLLL");
            }
            return date;
        }

        function getSetDate(obj, key){
            return function(newDate){
                obj[key] = new Date(newDate || obj[key]);

                return obj[key];
            };
            /*var type = key.type;
             if(_.isString(key)){
             type = vm.attrs[key].type;
             }
             return type && (type === 'date' || type === 'datetime' || type === 'time');*/
        }

        function filterQuery(item, index,list){
            var found = true, val = null, canon = vm.query.model;

            if(!_.isEmpty(vm.query.model) && angular.isString(vm.query.model)){
                var queries = vm.query.model.split(' ');
                for(var j = 0; j < queries.length; j++){
                    found = found && check(queries[j]);
                }
            }else if(angular.isString(vm.query.model) && _.isEmpty(vm.query.model) && vm.totalResource > list.length){
                getResources();
            }
            return found;

            function norm(str){
                return _.kebabCase(_.deburr(str));
            }

            function check(query){
                var tmp = false;
                canon = norm(query);
                for(var h = 0; h < vm.keys.length; h++){
                    val = item[vm.keys[h]];
                    if(isDate(val, vm.keys[h])){
                        val = norm(getDateHumanized(val, vm.keys[h]));
                    }else if(isString(val, vm.keys[h])){
                        val = norm(val);
                        //console.log(val, ' => ', tmp?'SI':'NO')
                    }
                    if(_.isString(val)){
                        tmp = tmp || val.indexOf(canon) > -1;
                    }
                }
                return tmp;
            }
        }

        function showListData(obj, key){
            $rootScope.openDialog({
                templateUrl: 'listdialog',
                controller: 'ListDialogCtrl',
                controllerAs: 'listdialog'
            },{
                obj:        obj,
                key:        key,
                list:       obj[key],
                attr:       vm.attrs[key],
                resource:   resource
            });
            /*$rootScope.openToast({
                text: 'Estamos trabajando'
            });*/
            /*$rootScope.openDialog({
                templateUrl: 'admineditDialog',
                controller: 'AdminEditDialogCtrl',
                controllerAs: 'admineditdialog'
            },{
                obj: obj,
                key: key,
                resource: resource
            })*/
        }
    }
})();
