/**
 * ArchivoController
 *
 * @description :: Server-side logic for managing archivoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var
    fs = require('fs'),
    path = require('path'),
    ClientFtp = require('jsftp'),
    Promise = require('bluebird'),
    pathUploads = '/uploads',
    ftp = null
    ;
/*ftp.on('jsftp_debug', function(eventType, data) {
    console.log('DEBUG: ', eventType);
    console.log(JSON.stringify(data, null, 2));
});*/

module.exports = {
    generateFilename: function(){
        return Token.generateTokenString();
    },
    getPathFile: function (filename){
        var este = this;
        return pathUploads + '/' + filename;
    },
    connectFTP: function connectFTP(){
        return new ClientFtp({
            host: 'ftp.camilopuello.com',
            port: '21',
            user: 'disk@solucionescucuta.com',
            pass: '();g%eKpN5dQ'
            //,debugMode: true // Se debe capturar el evento
        })
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
                ftp = this.connectFTP();
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
                ftp = this.connectFTP();
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
                promises = {},
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
                                ext = filename.split('.'),
                                filename_ = ''
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
                                filename_ = este.generateFilename() + ext;
                                promises[file.filename] =
                                    API.Model(Tipo).findOne({detalles: contentType}).then(function (tipo) {
                                        return  API.Model(Archivo).create({
                                            nombre: filename,
                                            filename: filename_,
                                            tipo: tipo.id,
                                            size: size,
                                            ext: ext,
                                            src: 'http://localhost:1337/files/' + filename_
                                        }).then(function (archivo) {
                                            if (err) {
                                                sails.log.error(archivo)
                                                //return err;
                                            }else{
                                                ftp = este.connectFTP();
                                                ftp.put(file.fd, este.getPathFile(archivo.filename), function (hadErr) {
                                                    if (hadErr) {
                                                        // delete archivo
                                                        sails.log.error(hadErr);
                                                        return hadErr;
                                                    }
                                                });
                                                return archivo;
                                            }
                                        });
                                    });
                            }
                        });
                        Promise.props(promises).then(function(rta){
                            res.json({
                                uploadeds: rta
                            });
                            //este.closeSessionFtp(res, archivos);
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
    },
    putFileForm: function putFileForm(req, res){
        var este = this;
        res.writeHead(200, {'content-type': 'text/html'});
        res.end(
            '<form action="/upload" enctype="multipart/forms-data" method="post">'+
            '<input id="filename" type="text" name="filename"><br>'+
            '<input id="file" type="file" name="file"><br>'+
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
                ftp = this.connectFTP();
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
        ftp = this.connectFTP();
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
            if (err) return console.error(err);
            if(!!res){
                if(!!res.json && !!obj){
                    res.json(obj);
                }else if(!!res.ok){
                    res.ok();
                }
            }
            //res.json(este.parseFeat(list));
            /*console.log("Bye!");
             console.log(data);
             console.log("Bye!");*/
        });
    }
};

