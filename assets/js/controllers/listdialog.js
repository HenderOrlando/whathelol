/**
 * Created by hender on 11/02/16.
 */

(function(){
    'use strict';

    /**
     * @ngdoc function
     * @name pempoApp.controller:ListDialogCtrl
     * @description
     * # ListDialogCtrl
     * Controller of the pempoApp
     */
    angular.module('SolucionesCucutaApp')
        .controller('ListDialogCtrl', [
            "$rootScope",
            "$translatePartialLoader",
            "$mdDialog",
            "$q",
            "pempoResource",
            "msg",
            ListDialogCtrl
        ]);

    function ListDialogCtrl(
        $rootScope,
        $translatePartialLoader,
        $mdDialog,
        $q,
        pempoResource,
        msg
    ) {
        //console.log('ToastCtrl')
        console.log(msg)

        $translatePartialLoader.addPart('htmlhead');

        var
            vm = this,
            Resource = null,
            options = [],
            criteria = {
                limit: 20,
                skip: 0
            }
        ;
        vm.close    = closeDialog;
        vm.attr     = msg.attr;
        vm.obj      = msg.obj;
        vm.key      = msg.key;
        vm.list     = msg.list;
        vm.checklist= {};
        vm.getOptions  = getOptions;
        vm.title    = vm.obj.nombre;
        vm.onClick  = onClick;
        vm.theme    = msg.theme || 'default';
        vm.search = {
            model: '',
            label: vm.key,
            filter: filterOption
        };
        vm.searchOpts = searchOpts;
        vm.list.filter(function(it){
            vm.checklist[it.id] = true;
        });

        Resource = pempoResource(vm.attr.model || vm.attr.collection);

        searchOpts();

        function getOptions(){
            return options;
        }

        function searchOpts(){
            return $q(function(resolve, reject){
                criteria.where = {
                    nombre: {
                        contains: vm.search.model
                    }
                };
                Resource.hateoas(criteria).then(function(opts){
                    options = opts;
                    resolve(opts);
                }, reject);
            });
        }

        function onClick($event, opt){
            var obj_ = angular.copy(vm.obj);
            /*angular.forEach(obj_, function(val, key){
                if(val.id){
                    obj_[key] = val.id;
                }
            });*/
            if(vm.checklist){
                if(vm.checklist[opt.id]){
                    obj_.$sub({
                        fk: opt.id,
                        association: vm.key
                    }, function(el){
                        //vm.obj = angular.merge(obj_, el);
                    });
                }else{
                    obj_.$add({
                        fk: opt.id,
                        association: vm.key
                    }, function(el){
                        //vm.obj = angular.merge(obj_, el);
                    });
                }
            }else{
                //No guardado
                /*obj_[vm.key] = vm.checklist;
                obj_.$save();*/
            }
        }

        function filterOption(item, index, list){
            var found = true, search = '';
            if(!_.isEmpty(vm.search.model) && angular.isString(vm.search.model)){
                found = false;
                search = $rootScope.canonicalizer(vm.search.model);
                if(_.isObject(item)){
                    var opts = ['nombre', 'descripcion', 'detalles'];
                    for(var h = 0; h < opts.length; h++){
                        if(_.isString(item[opts[h]])){
                            found = found || $rootScope.canonicalizer(item[opts[h]]).indexOf(search) > -1;
                        }
                    }
                }else {
                    found = $rootScope.canonicalizer(item).indexOf(search) > -1;
                }
            }
            return found;
        }

        function closeDialog($event){
            $event.preventDefault();
            $event.stopPropagation();
            $mdDialog
                .hide()
                .then(function(){

                })
            ;
        }
    }
})();
