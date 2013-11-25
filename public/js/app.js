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
        },

        start_socket: function(onopen_callback){
            App.socket = new WebSocket(window.location.origin.replace(/^http/, 'ws'));

            App.socket.onopen = onopen_callback;

            App.socket.onmessage = function(message){
                $('#loading').hide();
                $('#display').attr('src', message.data);
            };

            App.socket.onclose = function(){
                if (App.socket === false) return;

                setTimeout(function(){
                    App.start_socket();
                }, 1000);
            };
        },

        getUserMedia: function(options, success, error){
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            return navigator.getUserMedia(options, success, error);
        },

        open_webcam: function(){
            App.getUserMedia({ video: true }, App.start_webcam, App.webcam_error);
        },

        webcam_error: function(err){
            $('#lobby, #loading').hide();
            $('#webcam_error').show();

            console.log('webcam_error: ' + err);
        },

        start_webcam: function(stream){
            $('#loading').show();
            $('#lobby, #webcam_error').hide();

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

            App.start_socket(function(){
                App.capture_webcam_frame();
            });
        },

        capture_webcam_frame: function(){
            App.canvas.ctx.drawImage(App.webcam, 0, 0, App.canvas.el.width, App.canvas.el.height);

            var frame = App.canvas.el.toDataURL('image/png');

            App.socket.send(frame);
            setTimeout(App.capture_webcam_frame, 300);
        },

        error: function(err){
            alert(err);
        },
    };

    App.init();
});