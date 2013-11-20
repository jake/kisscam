$(function(){
    var App = {
        socket: false,
        webcam: false,

        canvas: {
            el: false,
            ctx: false,
        },

        init: function(stream){
            App.socket = new WebSocket('ws://' + window.location.hostname + ':9000');

            App.open_webcam();

            // App.socket.on('stream', function(stream, meta){
            //     stream.on('data', function(data){
            //         $('#video').attr('src', data);
            //     });
            // });

            // App.socket.on('error', function(err) {
            //     App.error(err);
            // });
        },

        getUserMedia: function(options, success, error){
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            return navigator.getUserMedia(options, success, error);
        },

        open_webcam: function(){
            App.getUserMedia({ video: true }, App.start_webcam_stream, App.error);
        },

        start_webcam_stream: function(stream){
            App.webcam = $('<video/>');

            App.webcam.css({
                width: 1000,
                height: 1000
            }).attr({
                autoplay: true,
                src: URL.createObjectURL(stream),
            });

            $('body').append(App.webcam);
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