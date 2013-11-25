var WebSocketServer = require('ws').Server;
var http = require('http');
var express = require('express');
var _ = require('underscore');
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

socket.broadcast = function(data){
    for (var i in this.clients) this.clients[i].send(data);
};

socket.broadcast_client_count = function(){
    this.broadcast(JSON.stringify({
        type: 'client_count',
        client_count: this.clients.length
    }));
};

var streams = {
    list: [],

    active: false,

    is_active: function(id){
        return id === this.active;
    },

    connect: function(id){
        this.list.push(id);

        if (! this.active) this.activate_random();
    },

    close: function(id){
        this.list = _.without(this.list, id);

        if (this.active == id) this.activate_random();
    },

    activate_random: function(){
        var active = _.sample(_.without(this.list, this.active));

        if (active) {
            this.active = active;
            console.log('switching to %j', this.active);
        } else {
            console.log('not switching as there is only one stream');
        }
    },
};

setInterval(function(){
    this.activate_random();
}.bind(streams), 5000);

socket.on('connection', function(stream) {
    stream.id = 'client-' + Date.now();

    streams.connect(stream.id);

    socket.broadcast_client_count();

    stream.on('message', function(message) {
        // Broadcast frame if its from the active stream
        if (streams.is_active(stream.id)) {
            socket.broadcast(message);
        }
    });

    stream.on('close', function() {
        console.log('WebSocket connection closed');
        streams.close(stream.id);
        socket.broadcast_client_count();
    });
});