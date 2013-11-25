var WebSocketServer = require('ws').Server;
var http = require('http');
var express = require('express');
var app = express();
var port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
server.listen(port);

console.log('==================================================');
console.log('HTTP server listening on port %d', port);
console.log('--------------------------------------------------');

var socket = new WebSocketServer({ server: server });

console.log('WebSocket server created');
console.log('==================================================');

socket.broadcast = function(data) {
    for (var i in this.clients) this.clients[i].send(data);
};

var active_stream_id = false;

socket.on('connection', function(stream) {
    stream.id = 'client-' + Date.now();

    if (! active_stream_id) active_stream_id = stream.id;

    stream.on('message', function(message) {
        if (stream.id === active_stream_id) {
            socket.broadcast(message);
        }
    });

    stream.on('close', function() {
        console.log('WebSocket connection close');

        if (active_stream_id === stream.id) active_stream_id = false;
    });
});