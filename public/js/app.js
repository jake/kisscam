$(function(){
    var App = {
        socket: false,
        webcam: false,

        canvas: {
            el: false,
            ctx: false,
        },

        init: function(stream){
            App.open_webcam();

            App.socket = new WebSocket('ws://' + window.location.hostname + ':9000');

            App.socket.onmessage = function(message){
                $('#display').attr('src', message.data);
            };
        },

        getUserMedia: function(options, success, error){
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            return navigator.getUserMedia(options, success, error);
        },

        open_webcam: function(){
            App.getUserMedia({ video: true }, App.start_webcam_stream, App.error);
        },

        start_webcam_stream: function(stream){
            App.webcam = $('<video/>').attr({
                width: 250,
                height: 250,
                autoplay: true,
                src: (window.URL || window.webkitURL).createObjectURL(stream),
            });

            App.canvas.el = $('<canvas/>').css({
                width: App.webcam.width(),
                height: App.webcam.height(),
            });

            App.webcam = App.webcam.get(0);
            App.canvas.el = App.canvas.el.get(0);

            App.canvas.ctx = App.canvas.el.getContext('2d');
            App.capture_webcam_frame();
        },

        capture_webcam_frame: function(){
            App.canvas.ctx.drawImage(App.webcam, 0, 0, App.canvas.el.width, App.canvas.el.height);

            var frame = App.canvas.el.toDataURL('image/png');

            App.socket.send(frame);
            setTimeout(App.capture_webcam_frame, 200);
        },

        error: function(err){
            alert(err);
        },
    };

    App.init();
});