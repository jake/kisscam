$(function(){
    var App = {
        socket: false,
        webcam: false,

        canvas: {
            el: false,
            ctx: false,
        },

        init: function(stream){
            App.socket = new BinaryClient('ws://' + window.location.hostname + ':9000');
            App.webcam = MediaStream({ video: true });

            // App.prep_canvas();

            App.webcam.on('data', function(data){
                App.socket.send(data);
            });

            App.webcam.on('error', function(err) {
                App.error(err);
            });

            App.socket.on('stream', function(stream, meta){
                stream.on('data', function(data){
                    $('#video').attr('src', data);
                });
            });

            App.socket.on('error', function(err) {
                App.error(err);
            });
        },

        prep_canvas: function(){
            App.canvas.el = $('#canvas').get(0);
            App.canvas.ctx = App.canvas.el.getContext('2d');
            App.canvas.ctx.fillStyle = '#444';
            App.canvas.ctx.fillText('Loading...', canvas.width / 2-30, canvas.height / 3);
        },

        error: function(err){
            alert(err);
        },
    };

    App.init();
});