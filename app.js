var express = require('express');
var ejs = require('ejs');

var app = express();
var WebSocketServer = require('ws').Server;

var ports = {
    http: process.env.PORT || 5000,
    socket: process.env.SOCKET_PORT || 9000,
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

var socket = new WebSocketServer({ port: ports.socket });
socket.broadcast = function(data) {
    for (var i in this.clients) this.clients[i].send(data);
};

var active_stream_id = false;

socket.on('connection', function(stream) {
    stream.id = 'client-' + Date.now();

    if (! active_stream_id) active_stream_id = stream.id;

    stream.on('message', function(message) {
        if (1 || stream.id === active_stream_id) {
            socket.broadcast(message);
        }
    });
});

app.listen(ports.http, function() {
    console.log('==================================================')
    console.log('==================================================')
    console.log('Listening for HTTP on port ' + ports.http);
    console.log('Listening for WebSocket on port ' + ports.socket);
    console.log('==================================================')
    console.log('==================================================')
});
