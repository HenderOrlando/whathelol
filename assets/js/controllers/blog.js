/**
 * Created by hender on 11/02/16.
 */

(function(){
    'use strict';

    /**
     * @ngdoc function
     * @name SolucionesCucutaApp.controller:BlogCtrl
     * @description
     * # BlogCtrl
     * Controller of the SolucionesCucutaApp
     */
    angular.module('SolucionesCucutaApp')
        .controller('BlogCtrl', [
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
            BlogCtrl]);

    function BlogCtrl(
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
        console.log('BlogCtrl');

        /*Connect.checkAuthenticated().then(function(isAuthenticated){
            console.log('isAuthenticated', isAuthenticated)
            if(isAuthenticated){
                $log.log('OK')
            }else{
                $log.error('BAD')
            }
        });*/

        $translatePartialLoader.addPart('lista');

        var
            almacen         = pempoLocalStorage,
            vm              = this,
            identity        = Connect.getIdentity(),
            host            = $location.host(),
            path            = $location.path().split('/'),
            Menu            = pempoResource('menu'),
            Publicacion     = pempoResource('publicacion'),
            Estado          = pempoResource('estado'),
            Tipo            = pempoResource('tipo'),
            Etiqueta        = pempoResource('etiqueta'),
            promises        = {},
            principales     = [],
            publicaciones   = []
        ;

        if(path.length <= 2){
            vm.search          = {
                label:  'que tema buscas?',
                filter: filterQuery,
                query:  '',
                button: {
                    label:  'buscar'/*,
                     icon:   'magnify'*/
                }
            };
            vm.menus            = [];
            vm.publicaciones    = [];
            vm.principales      = [];
            vm.getDateHumanized = getDateHumanized;
            vm.hasArchivo       = hasArchivo;
            vm.getEtiquetas     = getEtiquetas;
            vm.menuSelected     = -1;

            loadMenus().then(function(menus){
                Estado.hateoas({
                    canonical: 'publicado'
                }).then(function(estado){
                    estado = estado[0];
                    if(estado){
                        var pubs = [], ppals = [];
                        angular.forEach(menus, function(menu){
                            pubs.push(getPublicacionesEtiquetas(estado, menu.etiquetas, true));
                        });

                        $q.all(pubs).then(function(result){
                            for(var h = 0; h < result.length; h++){
                                publicaciones = publicaciones.concat(result[h] || []);
                            }
                            vm.publicaciones = publicaciones;
                            //console.log(publicaciones)
                        });

                        getPublicacionesPrincipalesEtiquetas(menus, estado);

                    }
                }, function(err){
                    // Estado no encontrado
                });

                function getPublicacionesPrincipalesEtiquetas(menus, estado){
                    return $q(function(resolve, reject){
                        var ppals = [], etqs = [];
                        angular.forEach(menus, function(menu){
                            etqs.push(
                                getPublicacionesEtiquetas(estado, menu.etiquetas, true, true)
                                    .then(function(query){
                                        delete query.populate.publicaciones.limit;
                                        ppals.push(getEtiquetasQuery(query));
                                    })
                            );
                        });
                        $q.all(etqs).then(function(res){
                            $q.all(ppals).then(function(result){
                                var ppals = [];
                                for(var h = 0; h < result.length; h++){
                                    ppals = ppals.concat(result[h] || []);
                                }
                                console.log(ppals)
                                //vm.principales = ppals;
                                resolve(ppals);
                            });
                        });
                    });

                    function getEtiquetasQuery(query){
                        return $q(function(resolve, reject){
                            Etiqueta.hateoas(query).then(function(etiqs){
                                var pubs = [];
                                etiqs.filter(function(etiq){
                                    pubs = pubs.concat(etiq.publicaciones || []);
                                });
                                resolve(pubs);
                            }, reject)
                        });
                    }
                }

                function getPublicacionesEtiquetas(estado, etiquetas, or, queryreturn){
                    return $q(function(resolve, reject){
                        if(etiquetas){
                            var
                                query = {},
                                etqs = etiquetas.map(function(pub){ return {id: pub.id} })
                            ;
                            if(or){
                                query['or'] = [etqs];
                            }else{
                                query['etiquetas'] = etqs
                            }
                            query['populate'] = {
                                publicaciones:{
                                    where: {
                                        estado: estado.id
                                    },
                                    limit: 1
                                }
                            };
                            if(queryreturn){
                                resolve(query);
                            }else{
                                Etiqueta.hateoas(query).then(function(etiqs){
                                    var pubs = [];
                                    etiqs.filter(function(etiq){
                                        pubs = pubs.concat(etiq.publicaciones || []);
                                    });
                                    resolve(pubs);
                                }, reject);
                            }
                        }else{
                            resolve([])
                        }
                    });
                }
                // 5 Publicaciones más sobresalientes
                /*Estado.read({
                    canonical: 'publicado'
                }).then(function(estado){
                    if(estado){
                        Publicacion.filter({
                            // Autor
                            //usuario: '5716eb93a3580a9f4fb63cf9',
                            // Publicación Principal del Menu
                            //tipo: '5718bd248b3eb386310287c1',
                            // Publicado
                            estado: '5718cb7930af6e38379cb4c0'
                        }).then(function(publicaciones){
                            //console.log(publicaciones)
                            vm.publicaciones = publicaciones;
                            //vm.lateral.publicaciones = publicaciones;
                        });
                    }
                }, function(err){
                    // Estado no encontrado
                });*/
            });

            // Publicaciones Principales
            principales = [
                {
                    /*span: {
                     row: 1,
                     col: 2
                     },*/
                    archivo: {
                        src: 'images/cover.jpg',
                        title: 'Soluciones Cúcuta'
                    },
                    nombre: 'Soluciones Cúcuta'
                },
                {
                    /*span: {
                     row: 1,
                     col: 1
                     },*/
                    archivo: {
                        src: 'images/cover-cian.jpg',
                        title: 'Soluciones Cúcuta'
                    },
                    nombre: 'Soluciones Cúcuta Cian'
                },
                {
                    /*span: {
                     row: 1,
                     col: 1
                     },*/
                    archivo: {
                        src: 'images/cover-grey.jpg',
                        title: 'Soluciones Cúcuta'
                    },
                    nombre: 'Soluciones Cúcuta Grey'
                },
                {
                    /*span: {
                     row: 1,
                     col: 2
                     },*/
                    archivo: {
                        src: 'images/cover-magenta.jpg',
                        title: 'Soluciones Cúcuta'
                    },
                    nombre: 'Soluciones Cúcuta Magenta'
                },
                {
                    /*span: {
                     row: 1,
                     col: 1
                     },*/
                    archivo: {
                        src: 'images/cover-cian.jpg',
                        title: 'Soluciones Cúcuta'
                    },
                    nombre: 'Soluciones Cúcuta Cian 2'
                },
                {
                    /*span: {
                     row: 1,
                     col: 1
                     },*/
                    archivo: {
                        src: 'images/cover.jpg',
                        title: 'Soluciones Cúcuta'
                    },
                    nombre: 'Soluciones Cúcuta 2'
                }
            ];

            $rootScope.addWatch(function(){
                return $mdMedia('gt-sm');
            }, function(gtSm){
                vm.principales = addSpanPublicaciones(principales);
            }, 'blogGtSm');
        }

        function addSpanPublicaciones(pubs){
            var tmp = null, list = [];
            pubs.filter(function(pub, k){
                var colspan = 1;
                if(k === 0 || k === 1){
                    colspan = 2;
                }
                pub['span'] = {
                    row: 1,
                    col: colspan
                };
                if(!$mdMedia('gt-sm') && k === 1){
                    tmp = pub;
                }else{
                    if(tmp && k === 4){
                        list.push(tmp);
                    }
                    list.push(pub);
                }
            });
            return list;
        }

        function loadMenus(){
            return $q(function(resolve, reject){
                var tipomenuname = 'menu-blog';
                Tipo.hateoas({
                    canonical: tipomenuname
                }).then(function(tipo){
                    tipo = tipo[0];
                    if(tipo){
                        Menu.hateoas({
                            tipo: tipo.id,
                            populate: 'etiquetas'
                        }).then(function(menus){
                            vm.menus = menus;
                            resolve(menus);
                        }, reject);
                    }else{
                        reject('no found tipo menu');
                    }
                }, reject);
            });
        }

        function filterQuery(item, index,list){
            var found = true;
            if(!_.isEmpty(vm.search.query) && angular.isString(vm.search.query)){
                //console.log(item)
                var querycanonical = _.kebabCase(_.deburr(vm.search.query));
                found = item.canonical.indexOf(querycanonical) > -1;
            }
            return found;
        }

        function getDateHumanized(date){
            //date = new Date(date);
            return moment(date).format("LLLL");
        }

        function hasArchivo(tipo, obj){
            if(obj && obj.archivos){
                pempoResource('tipo').query({
                    where: {
                        nombre: {
                            contains: tipo
                        },
                        tipoDe: 'archivo'
                    }
                }).then(function(tipo){
                    console.log(tipo)
                    var file = obj.archivos.filter(function(val){
                        return val.tipo === tipo.id;
                    })[0];
                    if(file && file.length > 0){
                        obj.archivoPrincipal = file;
                    }
                }, function(err){

                });
                return true;
            }else{
                return false;
            }
        }

        function getEtiquetas(obj){
            if(obj && obj.etiquetas){
                return obj.etiquetas.map(function(val){
                    return val.nombre;
                }).join(', ');
            }
            return '';
        }
    }
})();
