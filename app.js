var express = require('express');
var ejs = require('ejs');
var _ = require('underscore');

var app = express();
var BinaryServer = require('binaryjs').BinaryServer;

var ports = {
    http: process.env.PORT || 5000,
    binary: process.env.BINARY_PORT || 9000,
};

app.configure(function(){
    app.set('view engine', 'ejs');

    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.get('/', function(req, res){
    res.render('index');
});

app.listen(ports.http, function() {
    var binary = BinaryServer({ port: ports.binary });

    binary.on('connection', function(client){
        client.on('error', function(e){
            console.log(e.stack, e.message);
        });

        client.on('stream', function(stream, meta){
            for (var id in binary.clients){
                if (binary.clients.hasOwnProperty(id)){
                    var other = binary.clients[id];
                    stream.pipe(other.createStream(meta));
                }
            }
        });
    });

    console.log('==================================================')
    console.log('==================================================')
    console.log('Listening for HTTP on port ' + ports.http);
    console.log('Listening for Binary on port ' + ports.binary);
    console.log('==================================================')
    console.log('==================================================')
});
