/**
 * IndexController
 *
 * @description :: Server-side logic for managing indices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Promise = require('bluebird'),
    promisify = Promise.promisify,
    actionUtil = require('sails/lib/hooks/blueprints/actionUtil'),

    fs = require('fs'),
    path = require('path'),
    ClientFtp = require('jsftp'),
    pathUploads = '/uploads',
    ftp = new ClientFtp({
        host: 'ftp.camilopuello.com',
        port: '21',
        user: 'disk@solucionescucuta.com',
        pass: '();g%eKpN5dQ'
        //,debugMode: true // Se debe capturar el evento
    }),
    SkipperDisk = require('skipper-disk')
;

module.exports = {
	session: function(req, res){
        res.send(req.sessionID);
    },
	index: function(req, res){
        /*Menu
            .find({tipo: '5717e66041201db50a61b484'})
            .populate('submenu')
            .exec(function(err, menu){
                if(err){
                    res.negotiate(err);
                }
                return res.view({
                    menu: menu
                });
            })
        ;*/
        res.view();
    },
    findModelAction: function findModelAction(req, res) {

        if (actionUtil.parsePk(req)) {
            return require('./findOne')(req, res);
        }

        var
            params = req.params.all(),
            page = parseInt(params.page),
            query = null,
            checkPublicacion = params.model.toLowerCase() === 'publicacion'
        ;

        req.options.model = params.model.toLowerCase();

        var
            Model = actionUtil.parseModel(req),
            where = actionUtil.parseCriteria(req),
            limit = actionUtil.parseLimit(req),
            skip = actionUtil.parseSkip(req),
            sort = actionUtil.parseSort(req)
            ;
        //console.log(params)
        delete where.model;
        delete where.page;

        if(where.or && _.isString(where.or)){
            where.or = JSON.parse(where.or);
        }
        if(page){
            query = Model.find().paginate({page: page, limit: limit});
            skip = (page * limit) - limit;
            limit = (page * limit);
        }else{
            query = Model.find().limit(limit).skip(skip);
            if(skip > 0){
                page = page || (limit / (limit - skip));
            }else{
                page = 1;
            }
        }

        query = query.where(where).sort(sort);

        //query = actionUtil.populateRequest(query, req)

        if(!!params.populate){
            if(params.populate === true || params.populate === 'true'){
                query = query.populateAll();
            }else{
                try{
                    var
                        populate = JSON.parse(params.populate),
                        keysPopulate = Object.keys(populate)
                        ;
                    if(_.isArray(populate)){
                        query = query.populate(populate);
                    }else if(_.isObject(populate)){
                        for(var h = 0; h < keysPopulate.length; h++){
                            query = query.populate(keysPopulate[h], populate[keysPopulate[h]]);
                        }
                    }
                }catch(e){
                    query = query.populate([params.populate]);
                }
            }
        }

        query.exec(function(error, records) {

            if (error) {
                return res.negotiate(error);
            }
            if(checkPublicacion){
                var promises = [];
                var estado = API.Model(Estado);
                _.forEach(records, function(record){
                    if(record.hasPublicated()){
                        promises.push(estado.findOne({ canonical: 'publicado' }).then(function(estado){
                            record.estado = estado;
                            record.save();
                        }));
                    }
                });
                Promise.all(promises).then(function(){
                    returnHateoas();
                });
            }else{
                returnHateoas();
            }

            function returnHateoas(){
                Model.count(where).exec(function(error, count) {

                    if (error) {
                        return res.negotiate(error);
                    }

                    var
                        lastPage = parseInt(count/(limit - skip)),
                        nextPage = page + 1,
                        previousPage = page - 1
                        ;

                    if(count % (limit - skip) ){
                        lastPage++;
                    }
                    if(nextPage > lastPage){
                        nextPage = 1;
                    }
                    if(previousPage < 1){
                        previousPage = lastPage;
                    }

                    var metaInfo = {

                        start:  skip,
                        //end:    skip + limit,
                        //end:    skip + records.length,
                        end:    limit,
                        limit:  records.length,
                        total:  count,

                        firstPage:      1,
                        lastPage:       lastPage,
                        page:           page,
                        nextPage:       nextPage,
                        previousPage:   previousPage,

                        criteria: where,
                        sort: sort
                    };

                    if(req.isSocket){
                        var keys = records.map(function(val){ return val.id});
                        Model.watch(req);
                        Model.subscribe(req, keys);
                    }

                    //res.set('content-range', metaInfo.start + '-' + metaInfo.end + '/' + metaInfo.total);
                    res.set('metainfo', metaInfo);
                    return res.ok(records, null, null, metaInfo);
                });
            }
        });
    },
    paramsAction: function(req, res){
        var params = req.params.all();
        req.options.model = params.model;
        var
            attrs = {},
            Model = actionUtil.parseModel(req),
            attributes = Model.attributes,
            modelname = Model.identity,
            blacklist = [
                'id', 'createdAt', 'updatedAt', 'canonical',
                // Archivo
                'archivo.ext', 'archivo.size', 'archivo.src',
                // Estados
                'estado.serviciousuarios',
                // Etiquetas
                '',
                // Gastos
                'gasto.usuario',
                // Menus
                '',
                // Páginas
                '',
                // Pagos - 'serviciousuario'
                '',
                // Permisos
                '',
                // Publicaciones
                '',
                // Roles
                'rol.serviciousuario',
                // Servicios
                '',
                // Tipos
                '',
                // Usuarios
                'usuario.password', 'usuario.tokens', 'usuario.cliente',
                // Clientes
                'cliente.canonicalorganizacion'
            ]
        ;
        _.forEach(attributes, function(attr, key){
            if(blacklist.indexOf(key) < 0 && blacklist.indexOf(modelname + '.' + key) < 0){
                attrs[key] = attr;
            }
        });
        res.json({
            attrs: attrs
        });
    },

    /*
    * FileManager
    */

    /*generateFilename: function(){
        return Token.generateTokenString();
    },
    getPathFile: function (filename){
        var este = this;
        return pathUploads + '/' + filename;
    },
    getFile: function getFile(req, res){
        var
            este = this,
            params = req.allParams(),
            filename = params.filesname
            ;
        // res.send(req.sessionID);
        if(filename){
            //'/test_file.txt'
            if(_.isString(filename) && filename.length){
                ftp.get(este.getPathFile(filename), function(err, socket) {
                    console.log(err)
                    // error.code = 550 # on no such file or directory
                    if (err){
                        if(err.code === 550){
                            return res.notFound('No such file');
                        }
                        return res.negotiate(err);
                    }

                    socket.on("data", function(d) {
                        res.send(d);
                    });
                    socket.on("close", function(hadErr) {
                        if (hadErr){
                            sails.log.error('There was an error retrieving the file.');
                            return res.negotiate(hadErr);
                        }
                        este.closeSessionFtp(res);
                        return res.end();
                    });
                    socket.resume();
                });
            }else{
                return res.error(404);
            }
        }else{
            return este.listFile(req, res);
        }
    },
    openFile: function openFile(req, res){
        var
            este = this,
            params = req.allParams(),
            filename = params.filesname,
            filecontent = '',
            responseEnd = false
            ;
        // res.send(req.sessionID);
        if(filename){
            //'/test_file.txt'
            if(_.isString(filename) && filename.length){
                ftp.get(este.getPathFile(filename), function(err, socket) {
                    // error.code = 550 # on no such file or directory
                    if (err){
                        if(err.code === 550){
                            return res.notFound('No such file');
                        }
                        return res.negotiate(err);
                    }

                    socket.on("data", function(d) {
                        filecontent += d;
                        //res.send(d);
                        res.write(d);
                    });
                    socket.on("close", function(hadErr) {
                        if (hadErr){
                            sails.log.error('There was an error retrieving the file.');
                            return res.negotiate(hadErr);
                        }else{
                            //res.json(filecontent);
                            //res.write(filecontent);
                        }
                        este.closeSessionFtp(res);
                        return res.end();
                    });
                    socket.resume();
                });
            }else{
                return res.error(404);
            }
        }else{
            return este.listFile(req, res);
        }
    },
    putFile: function putFile(req, res){
        try{
            var
                este = this,
                //params = req.params.all(),
                archivos = [],
                promises = [],
                files = req.file('file')
            ;
            files.upload(function(err, uploaded){
                if(err){
                    res.negotiate(err);
                }
                else if(uploaded){
                    if(uploaded.length <= 0){
                        res.badRequest('File not found');
                    }else{
                        var rta = [];
                        _.forEach(uploaded, function(file, key){
                            rta.push(file);
                            var
                                contentType = file.type,
                                filename = file.filename,
                                size = file.size,
                                ext = filename.split('.')
                            ;
                            if(filename) {
                                ext = ext[ext.length - 1];
                                if (_.isString(ext) && ext.length) {
                                    ext = '.' + ext;
                                } else {
                                    ext = '';
                                }
                                if (filename.indexOf(ext) < 0) {
                                    filename += ext;
                                }
                                if (filename[0] === '.') {
                                    filename[0] = '_';
                                }
                                Tipo.findOne({detalles: contentType}).exec(function (err, tipo) {
                                    if (err) {
                                        return err;
                                    }
                                    var filename_ = este.generateFilename() + ext;
                                    promises.push(
                                        API.Model(Archivo).create({
                                            nombre: filename,
                                            filename: filename_,
                                            tipo: tipo.id,
                                            size: size,
                                            ext: ext,
                                            src: 'http://localhost:1337/files/' + filename_
                                        }).then(function (archivo) {
                                            sails.log.error(archivo)
                                            if (err) {
                                                return err;
                                            }
                                            ftp.put(file.fd, este.getPathFile(archivo.filename), function (hadErr) {
                                                if (hadErr) {
                                                    sails.log.error(hadErr);
                                                    return hadErr;
                                                }else{
                                                    sails.log.error(file)
                                                    ftp.keepAlive(1000);
                                                }
                                            });
                                            archivos.push(archivo);
                                            return archivo;
                                        }, function(err){
                                            //delete File
                                        })
                                    );
                                });
                            }else{
                                //res.badRequest('File required fieldname');
                            }
                        });
                        Promise.all(promises).then(function(rta){
                            sails.log.error(rta)
                            este.closeSessionFtp(res, archivos);
                        }, function(err){
                            res.negotiate(err);
                        });
                        //res.json(rta);
                    }
                }else{
                    throw 'Files not found';
                }
            });
        }catch(e){
            res.notFound();
        }
        /!*if(!files.isNoop && files._files && files._files.length > 0){
            _.forEach(files._files, function(file, key){
                var stream = file.stream,
                    contentType = stream.headers['content-type'],
                    filename = (params[key] && params[key].filename) || stream.filename,
                    size = stream.byteCount,
                    ext = stream.filename.split('.')
                    ;
                if(filename) {
                    ext = ext[ext.length - 1];
                    if (_.isString(ext) && ext.length) {
                        ext = '.' + ext;
                    } else {
                        ext = '';
                    }
                    if (filename.indexOf(ext) < 0) {
                        filename += ext;
                    }
                    if (filename[0] === '.') {
                        filename[0] = '_';
                    }
                    Tipo.findOne({detalles: contentType}).exec(function (err, tipo) {
                        if (err) {
                            return res.negotiate(err);
                        }
                        var filename_ = este.generateFilename() + ext;
                        Archivo.create({
                            nombre: filename,
                            filename: filename_,
                            tipo: tipo.id,
                            size: size,
                            ext: ext,
                            src: 'http://localhost:1337/files/' + filename_
                        }).exec(function (err, archivo) {
                            if (err) {
                                return res.negotiate(err);
                            }
                            //res.ok(archivo);
                            ftp.put(stream, este.getPathFile(archivo.filename), function (hadErr) {
                                if (hadErr) {
                                    sails.log.error(hadErr);
                                    sails.log.error('There was an error retrieving the file.');
                                    return res.negotiate(hadErr);
                                }
                                archivos.push(archivo);
                                //este.closeSessionFtp(res, archivo);
                            });
                        });
                    });
                }
            });
            return este.closeSessionFtp(res, archivos);
        }else if(files._files && files._files.length <= 0){
            return res.send(400, 'Not files founded');
        }
        return res.notFound();*!/
        //res.send(req.sessionID);
    },
    putFileForm: function putFileForm(req, res){
        var este = this;
        res.writeHead(200, {'content-type': 'text/html'});
        res.end(
            '<form action="/upload" enctype="multipart/form-data" method="post">'+
            '<input id="title" type="text" name="title"><br>'+
            '<input id="file" type="file" name="file" multiple="multiple"><br>'+
            '<input type="submit" value="Upload">'+
            '</form>'
        )
    },
    removeFile: function removeFile(req, res){
        var
            este = this,
            params = req.allParams(),
            filename = params.filesname
            ;
        if(filename){
            if(_.isString(filename) && filename.length){
                ftp.raw.dele(este.getPathFile(filename), function(err, data){
                    if(err || data.isError){
                        return res.negotiate(err);
                    }
                    este.closeSessionFtp(res);
                });

            }
        }else{
            return res.notFound();
        }
    },
    listFile: function listFile(req, res){
        var este = this;
        //ftp.ls('/', function(err, list){
        //ftp.raw.cd();
        ftp.ls(pathUploads, function(err, list){
            if(err){
                return res.negotiate(err);
            }
            if(list.length){
                list = list.filter(function(file){
                    return file.name[0] !== '.';
                });
            }
            este.closeSessionFtp(res, list);
        });
    },
    closeSessionFtp: function closeSessionFtp(res, obj){
        ftp.raw.quit(function(err, data) {
            if (err){
                return console.error(err);
            }
            if(!!res){
                if(!!res.json && !!obj){
                    res.json(obj);
                }else if(!!res.ok){
                    res.ok();
                }
            }
            //res.json(este.parseFeat(list));
            /!*console.log("Bye!");
             console.log(data);
             console.log("Bye!");*!/
        });
    }*/
};

