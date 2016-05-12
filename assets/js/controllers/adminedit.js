/**
 * Created by hender on 11/02/16.
 */

(function(){
    'use strict';

    /**
     * @ngdoc function
     * @name SolucionesCucutaApp.controller:AdminEditCtrl
     * @description
     * # AdminEditCtrl
     * Controller of the SolucionesCucutaApp
     */
    angular.module('SolucionesCucutaApp')
        .controller('AdminEditCtrl', [
            "$rootScope",
            "$translatePartialLoader",
            "pempoLocalStorage",
            "pempoResource",
            '$state',
            '$stateParams',
            'templateCache',
            '$location',
            'Connect',
            '$q',
            '$log',
            AdminEditCtrl]);

    function AdminEditCtrl(
        $rootScope,
        $translatePartialLoader,
        pempoLocalStorage,
        pempoResource,
        $state,
        $stateParams,
        templateCache,
        $location,
        Connect,
        $q,
        $log
    ) {
        //console.log('AdminEditCtrl');

        /*console.log($rootScope.listEdit)

        if(!$rootScope.listEdit || !$rootScope.listEdit.length){
            $state.go('admin.resource');
        }*/



        /*console.log($stateParams.resourcename)
        console.log($stateParams.id)*/

        $translatePartialLoader.addPart('lista');

        var
            id          = $stateParams.id,
            almacen     = pempoLocalStorage,
            resource    = $stateParams.resourcename,
            vm          = this,
            identity    = {},
            host        = $location.host(),
            path        = $location.path(),
            Resource    = null,
            tmp         = {}
        ;

        if(!resource){
            $state.go('admin.resource');
            $rootScope.openToast('Recurso no válido');
        }else{
            vm.menu = $rootScope.getMenuAdmin().filter(function(val){
                return val.model === resource;
            })[0];

            $rootScope.menuactual = vm.menu;

            vm.obj = null;
            vm.fieldstemplate = templateCache.getForm('fields');
            vm.deleteResource = deleteResource;
            vm.saveResource = saveResource;
            vm.getOpts = getOpts;
            vm.resource = resource;
            vm.options = {};
            vm.search = {};
            vm.labels = {};
            vm.attrs = {};
            vm.keys = [];

            vm.selectedObj = {};

            vm.openFilemanager = openFilemanager;

            vm.autocompleteSelectedItemChange = autocompleteSelectedItemChange;
            vm.autocompleteSearchTextChange = autocompleteSearchTextChange;
            vm.autocompleteSearchItemChange = autocompleteSearchItemChange;
            vm.autocompleteSearchText = {};

            vm.autocompleteTransformChip = autocompleteTransformChip;
            vm.autocompleteOnRemoveChip = autocompleteOnRemoveChip;
            vm.autocompleteOnAddChip = autocompleteOnAddChip;
            vm.autocompleteCheck = autocompleteCheck;
            vm.getInfoSelectChip = getInfoSelectChip;
            vm.requireMatchChip = requireMatchChip;
            vm.autocompleteSearchText = {};

            vm.tinymceFileupload = {
                submit: tinymceFileuploadSubmit,
                model: {},
                change: function(){}
            };
            vm.tinymceoption = {
                //plugins: 'link image code',
                //toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
                plugins: [
                    'advlist autolink lists link image charmap print preview hr anchor pagebreak',
                    'searchreplace wordcount visualblocks visualchars code fullscreen',
                    'insertdatetime media nonbreaking save table contextmenu directionality',
                    'emoticons template paste textcolor colorpicker textpattern imagetools'
                ],
                toolbar: '| responsivefilemanager | insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | media image link | print preview | forecolor backcolor emoticons',
                image_advtab: true,
                imagetools_toolbar: "rotateleft rotateright | flipv fliph | editimage imageoptions",
                images_upload_url: '/file-form',
                images_upload_base_path: '/files/',
                file_picker_callback: getFilePicker
                /*
                images_upload_credentials: true,
                file_picker_types: 'file image media',
                file_browser_callback_types: 'file image media',
                automatic_uploads: true,
                file_picker_callback: function(callback, value, meta) {
                    console.log(value, meta)
                    // Provide file and text for the link dialog
                    if (meta.filetype == 'file') {
                        callback('mypage.html', {text: 'My text'});
                    }

                    // Provide image and alt text for the image dialog
                    if (meta.filetype == 'image') {
                        callback('myimage.jpg', {alt: 'My alt text'});
                    }

                    // Provide alternative source and posted for the media dialog
                    if (meta.filetype == 'media') {
                        callback('movie.mp4', {source2: 'alt.ogg', poster: 'image.jpg'});
                    }
                },
                file_browser_callback: function(field_name, url, type, win) {
                    console.log(field_name)
                    console.log(url)
                    console.log(type)
                    console.log(win)
                    win.document.getElementById(field_name).value = 'my browser value';
                }
                images_upload_handler: function (blobInfo, success, failure) {
                    var xhr, formData;

                    xhr = new XMLHttpRequest();
                    xhr.withCredentials = false;
                    xhr.open('POST', 'postAcceptor.php');

                    xhr.onload = function() {
                        var json;

                        if (xhr.status != 200) {
                            failure('HTTP Error: ' + xhr.status);
                            return;
                        }

                        json = JSON.parse(xhr.responseText);

                        if (!json || typeof json.location != 'string') {
                            failure('Invalid JSON: ' + xhr.responseText);
                            return;
                        }

                        success(json.location);
                    };

                    formData = new FormData();
                    formData.append('file', blobInfo.blob(), blobInfo.filename());

                    xhr.send(formData);
                }
                */
            };

            Resource = pempoResource(resource);
            vm.obj = Resource.model();
            Resource.form().then(function (form){
                //console.log(form);
                vm.attrs = form;
                vm.keys = Object.keys(form);
                loadOptions()/*.then(function(result){
                    console.log(result);
                })*/;
                if(id){
                    Resource.read({id: id}).then(function(res){
                        if(res) {
                            console.log(res)
                            var q = [];
                            Connect.setOnChanged(resource, function(event, message){
                                if(message.type === 'updated'){
                                    Resource.read({id: message.id}).then(function(item){
                                        vm.obj = item;
                                    });
                                }
                            }, res.id);

                            angular.forEach(form, function(attr, key){
                                if(attr.type === 'text' && !res[key]){
                                    res[key] = '';
                                }
                                q.push(getNombreItem(res[key]).then(setItem(key)));
                            });

                            $q.all(q).then(function(result){
                                vm.obj = res;

                                tmp[res.id] = angular.copy(res);

                                $rootScope.addWatch(function(){
                                    return vm.obj;
                                }, function(newObj){
                                    vm.obj.$updated = angular.equals(newObj, tmp[newObj.id]);
                                }, 'adminedit_obj', true);
                            });
                        }
                        function setItem(key){
                            return function(item){
                                vm.obj[key] = item;
                            }
                        }
                    });
                }
            });
            /*Resource.read({id: id}).then(function(res){
                //console.log(res);
                if(res){
                    vm.obj = res;

                    Resource.form().then(function (form){
                        console.log(form);
                        vm.attrs = form;
                        vm.keys = Object.keys(form);
                        loadOptions();
                        angular.forEach(form, function(attr, key){
                            if(attr.type === 'text' && !vm.obj[key]){
                                vm.obj[key] = '';
                            }
                        });
                        tmp[res.id] = angular.copy(res);

                        $rootScope.addWatch(function(){
                            return vm.obj;
                        }, function(newObj){
                            vm.obj.$updated = angular.equals(newObj, tmp[newObj.id]);
                        }, 'adminedit_obj', true);
                        /!*
                         console.log(forms)
                         console.log(vm.keys)
                         *!/
                    });
                }else{
                    // Resource no encontrado
                }
            }, function(err){
                //$log.error(err);
            });*/
        }

        function getOpts(selected, key){
            return $q(function(resolve, reject){
                var
                    found = vm.autocompleteSearchText[key].length > 0,
                    list = vm.options[key],
                    val = selected,
                    attr = vm.attrs[key]
                    ;
                /*console.log(vm.obj[key])
                 console.log(vm.options[key])*/
                //if(list.length < 10){
                    checkList();
                /*}else{
                    loadOptions(key, vm.obj).then(checkList);
                }*/
                //return list;
                function checkList(){
                    loadOptions(key).then(function(list){
                        /*list = vm.options[key].map(function(item){
                            getNombreItem(item).then(function(it){
                                item = it;
                            });
                            return item;
                        });*/
                        list = vm.options[key].filter(function(opt){
                            found = false;
                            if(opt){
                                if(_.isString(opt)){
                                    found = $rootScope.canonicalizer(opt).indexOf($rootScope.canonicalizer(vm.autocompleteSearchText[key])) > -1;
                                }else if(_.isString(opt.nombre)){
                                    found = $rootScope.canonicalizer(opt.nombre).indexOf($rootScope.canonicalizer(vm.autocompleteSearchText[key])) > -1;
                                }
                            }
                            return found;
                        });
                        list = list.map(function(item){
                            getNombreItem(item).then(function(it){
                                item = it;
                            });
                            return item;
                        });
                        vm.options[key] = list;
                        resolve(list);
                    });
                    /*if(found){
                        loadOptions(key).then(function(list){
                            list = vm.options[key].map(function(item){
                                getNombreItem(item).then(function(it){
                                    item = it;
                                });
                                return item;
                            });
                            vm.options[key] = list;
                            resolve(list);
                        });
                    }else{
                        if(vm.options[key] && vm.options[key].length){
                            list = vm.options[key].filter(function(opt){
                                found = false;
                                if(opt){
                                    if(_.isString(opt)){
                                        found = $rootScope.canonicalizer(opt).indexOf($rootScope.canonicalizer(vm.autocompleteSearchText[key])) > -1;
                                    }else if(_.isString(opt.nombre)){
                                        found = $rootScope.canonicalizer(opt.nombre).indexOf($rootScope.canonicalizer(vm.autocompleteSearchText[key])) > -1;
                                    }
                                }
                                return found;
                            });
                            list = list.map(function(item){
                                getNombreItem(item).then(function(it){
                                    item = it;
                                });
                                return item;
                            });
                            resolve(list);
                        }else{

                        }
                    }*/
                }
            });
        }

        function getNombreItem(item){
            if(_.isObject(item) && !item.nombre){
                item.nombre = '';
                var attrsNombres = [
                        'username',
                        'servicio',
                        'rol',
                        'usuario',
                        'estado'
                    ],
                    addChar = false,
                    char = ' - ',
                    h = 0,
                    q = []
                ;
                for(h = 0; h < attrsNombres.length; h++){
                    if(item[attrsNombres[h]] && !item[attrsNombres[h]].nombre){
                        q.push(getItem(attrsNombres[h]));
                    }
                }
            }
            return $q(function(resolve, reject){
                $q.all(q).then(function(result){
                    if(attrsNombres){
                        for(h = 0; h < attrsNombres.length; h++){
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
                    resolve(item);
                }, reject)
            });

            function getItem(attrname){
                return pempoResource(attrname).read({id: item[attrname]}).then(function(it){
                    item[attrname] = it;
                    return it;
                })
            }
        }

        function autocompleteSearchItemChange(val, key, item){
            /*console.log(' +++++++++++++++++++++ ')
            console.log(val)
            console.log(key)
            console.log(item)
            console.log(' +++++++++++++++++++++ ')*/
            //$log.log(val, key, item)
        }

        function autocompleteSearchTextChange(val, key, item){
            //console.log(key)
            loadOptions(key);
            /*console.log(' --------- ')
            console.log(val)
            console.log(key)
            console.log(item)
            console.log(' --------- ')*/
            //$log.log(val, key, item)
        }

        function autocompleteSelectedItemChange(val, key, item){
            /*console.log(' ********************* ')
            console.log(val)
            console.log(key)
            console.log(item)
            console.log(' ********************* ')*/
            //$log.log(val, key, item)
        }

        function autocompleteTransformChip(val, key, $chip){
            //$log.log(val, key, $chip)
            /*console.log(' //////////////////// ')
            console.log(val)
            console.log(key)
            console.log($chip)
            console.log(' //////////////////// ')*/
            var model = $chip;
            if(angular.isObject($chip)){
                return $chip;
            }
            if(val.collection){
                model = pempoResource(val.collection);
                if(model){
                    model = model.model();
                    model.nombre = $chip;
                    //model.canonical = $chip;
                    //vm.options[key] = vm.options[key] || [];
                    //vm.options[key].push(model);
                }
            }
            return model;
        }

        function autocompleteOnRemoveChip(val, key, $chip, obj){
            loadOptions(key, vm.obj).then(
                function (){
                    if(obj.id){
                        var idChip = $chip.id || $chip;
                        obj.$sub({
                            fk: idChip,
                            association: key
                        }, function(){
                            tmp[obj.id][key] = angular.copy(obj[key]);
                            obj[key] = obj[key].filter(function(val){
                                return val.id !== idChip;
                            });
                        });
                    }
                });
            /*obj[key] = obj[key] || [];
            obj[key] = obj[key].filter(function(val){
                if(!$chip.id){
                    return $rootScope.canonicalizer(val.nombre) !== $rootScope.canonicalizer($chip.nombre);
                }
                return val !== $chip
            });*/
            //$log.log(val, key, $chip)
            /*console.log(' ==================== ')
            console.log(val)
            console.log(key)
            console.log($chip)
            console.log(' ==================== ')*/
        }

        function autocompleteOnAddChip(val, key, $chip, obj){
            loadOptions(key, vm.obj).then(function(){
                if(obj.id){
                    if($chip.id){
                        obj.$add({
                            fk: $chip.id,
                            association: key
                        }, updateTmp);
                    }else if($chip.$save) {
                        $chip.$save(function(el){
                            $chip.id = el.id;
                            obj.$add({
                                fk: $chip.id,
                                association: key
                            }, updateTmp);
                        }, function (err){
                            //console.log(err)
                        })
                    }
                }
            });
            function updateTmp(){
                tmp[obj.id][key] = angular.copy(obj[key]);
            }
            //console.log(obj)
            /*obj[key] = obj[key] || [];
            obj[key].push($chip);*/
            //$log.log(val, key, $chip)
            /*console.log(' &&&&&&&&&&&&&&&&&&&&& ')
            console.log(val)
            console.log(key)
            console.log($chip)
            console.log(' &&&&&&&&&&&&&&&&&&&&& ')*/
        }

        function getInfoSelectChip(val, key, obj, $event){
            var selectedIndexChip = angular.element($event.currentTarget).controller('mdChips').selectedChip;
            if(selectedIndexChip > -1){
                console.log(obj[key][selectedIndexChip])
            }
        }

        function requireMatchChip(val, key, obj){
            /*console.log(val)
            console.log(key)
            console.log(obj)*/
            var required = true;
            if(key === 'etiquetas'){
                required = false;
            }
            return required;
        }

        function autocompleteCheck(item, key, obj){
            var
                obj_ = tmp[obj.id] && tmp[obj.id][key]?tmp[obj.id][key].id || tmp[obj.id][key]:null,
                item_ = item?item.id || item:'',
                found = item_ === obj_
            ;
            if(_.isArray(obj_)){
                var filter = obj_.filter(function(val){
                    var f = val === item_;
                    if(_.isObject(val)){
                        f = val.id === item_;
                    }
                    return f;
                });
                found = filter.length > 0;
            }
            return found;
        }

        function loadOptions (key, obj){
            return $q(function(resolve, reject){
                var
                    keys = Object.keys(vm.attrs),
                    q = []
                ;
                if(key){
                    q.push(loadOptionsKey(key));
                }else{
                    for(var h = 0; h < keys.length; h++){
                        q.push(loadOptionsKey(keys[h]));
                    }
                }
                $q.all(q).then(function(){
                    resolve(vm.options);
                }, reject);
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
                            vm.options[key] = attr.enum;
                            resolve(attr.enum);
                        }else if(attr.model || attr.collection){
                            vm.options[key] = [];
                            var
                                listDe = ['estado', 'tipo'],
                                Model = pempoResource(attr.model || attr.collection),
                                criteria = {
                                    limit: 20,
                                    skip: 0
                                }
                            ;
                            if(vm.autocompleteSearchText[key] && vm.autocompleteSearchText[key].length){
                                criteria.where = {
                                    nombre: {
                                        contains: vm.autocompleteSearchText[key]
                                    }
                                };
                            }
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
                                    vm.options[key] = options;
                                    resolve(options)
                                }, reject);
                            }else{
                                Model.hateoas(criteria).then(function(options){
                                    /*var metainfo = options.$headers.metainfo;
                                     if(metainfo.total > criteria.limit){
                                     // volver a cargar con el total
                                     }*/
                                    //console.log(options)
                                    vm.options[key] = options;
                                    resolve(options);
                                }, reject);
                            }
                        }else{
                            reject('bad query options');
                        }
                    //}
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

        function deleteResource(){
            vm.obj.$delete(function(el){
                $state.go('admin.resource');
                $rootScope.openToast(resource + ' borrado');
            }, function (err){
                $log.error(err);
            });
        }

        function saveResource (){
            var
                obj_ = angular.copy(vm.obj),
                collections = {}
            ;

            angular.forEach(vm.attrs, function(attr, key){
                if(_.isObject(obj_[key])){
                    if(attr.type && (attr.type === 'date' || attr.type === 'time' || attr.type === 'datetime')){
                        obj_[key] = moment(obj_[key]).utc().toString();
                    }else if(attr.model && obj_[key].id){
                        obj_[key] = obj_[key].id;
                    }
                }else{
                    delete obj_[key];
                }
            });
            console.log(obj_)
            if(!angular.equals(obj_, tmp[obj_.id])){
                var qs = [];
                if(!obj_.id){
                    angular.forEach(vm.attrs, function(attr, key){
                        if(attr.collection && obj_[key]){
                            obj_[key].filter(function(item, k){
                                if(!item.id && item.$save){
                                    qs.push(item.$save(function(el){
                                        collections[key] = collections[key] || [];
                                        collections[key].push(el.id);
                                        obj_[key][k]= el.id;
                                        var rta = {};
                                        rta[key] = el.id;
                                    }, function (err){
                                        //console.log(err)
                                        obj_[key].splice(k,1);
                                    }));
                                }
                            });
                        }
                    });
                }
                $q.all(qs).then(function(result){
                    var
                        usr = Connect.getIdentity(),
                        isNew = !obj_.id
                    ;
                    if(resource === 'gasto' && usr.id){
                        obj_.usuario = usr.id;
                    }
                    obj_.$save(function(el){
                        var qs_ = [];
                        angular.forEach(collections, function(collection, key){
                            if(vm.attrs[key].collection){
                                var h = 0;
                                while(h < collection.length){
                                    qs_.push(el.$add({
                                        fk: collection[h],
                                        association: key
                                    }));
                                    h++;
                                }
                            }
                        });
                        $q.all(qs_).then(function(){
                            //vm.obj = el;
                            vm.obj.$updated = true;
                            tmp[vm.obj.id] = angular.copy(vm.obj);
                            $rootScope.openToast({
                                text: (isNew?'Creado':'Actualizado') + '!!'
                            });
                            if(isNew){
                                vm.obj = Resource.model();
                                tmp = angular.copy(vm.obj);
                                angular.forEach(vm.autocompleteSearchText, function(val, key){
                                    vm.autocompleteSearchText[key] = '';
                                });
                            }
                        });
                    }, function(err){
                        console.log(err)
                        //$log.error(err);
                    });
                });
            }else{
                $rootScope.openToast({
                    text: 'Ya se encuentra Actualizado.'
                });
                //console.log('NO GUARDADO')
            }
        }

        function tinymceFileuploadSubmit(){
            console.log('tinymce fileupload submit')
        }

        function getFilePicker(cb, value, meta) {
            //console.log(field_name, url, type, win)
            console.log(value, meta, cb)
            $rootScope.openFilemanager({

            }, {
                title: 'Selecciona ',
                meta: meta,
                value: value,
                multiple: meta.filetype === 'media'?2:false,
                cb: function(fileSelected){
                    if(fileSelected && fileSelected.id){
                        if (meta.filetype == 'image') {
                            // cb('myimage.jpg', {alt: 'My alt text'});
                            cb(fileSelected.src, {alt: fileSelected.nombre});
                        }else if (meta.filetype == 'media') {
                            // cb('movie.mp4', {source2: 'alt.ogg', poster: 'image.jpg'});
                            cb(fileSelected.src, {alt: fileSelected.nombre});
                        }else{
                            // cb('mypage.html', {text: 'My text'});
                            cb(fileSelected.src, {
                                title: fileSelected.nombre,
                                text: fileSelected.descripcion || fileSelected.nombre
                            });
                        }
                    }
                }
            });
            /*var
                formFile = angular.element('#form-fileupload-tinymce'),
                namebase = '#file-browser',
                name = namebase + '-' + field_name,
                ngUpload = formFile.children()[0],
                inputFile = angular.copy(ngUpload)
            ;*/
            //inputFile.attr({id: name})
            //listFormFile.append(inputFile)
            //inputFile.click();
            //ngUpload.click();
        }

        function openFilemanager(attr, key, obj, $event){
            console.log($event)
            $rootScope.openFilemanager({
                fullScreen: false,
                attr: attr,
                openFrom: $event.currentTarget,
                closeTo: $event.currentTarget
            },{
                value: obj[key],
                title: key
            }).then(function(files){
                if(files){
                    //obj[key] = files;
                    if(vm.attrs[key].collection){
                        /*var removeFiles = [], addFiles = [];
                        addFiles = files.filter(function(file){
                            if(!file.$resolved)
                            return file.$resolved;
                        });*/
                        obj[key] = obj[key] || [];
                        var h = 0;
                        // Si no existe en files pero si en obj
                        for(h = 0; h < obj[key].length; h++){
                            if(!existFile(obj[key][h], files)){
                                autocompleteOnRemoveChip(attr, key, obj[key][h], obj);
                            }
                        }
                        // Los que quedan se agregan si son resource
                        for(h = 0; h < files.length; h++){
                            if(files[h].$resolved){
                                autocompleteOnAddChip(attr, key, files[h], obj);
                            }
                        }
                    }else if(vm.attrs[key].model){
                        if(obj.id){
                            obj[key] = files;
                            obj.$save();
                        }
                    }
                }

                function existFile(file, files){
                    return files.filter(function(fil){
                        return fil.id === file.id;
                    }).length > 0;
                }
            });
        }
    }
})();
