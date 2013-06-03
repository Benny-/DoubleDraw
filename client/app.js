Ext.application({
    name: 'DD', // DoubleDraw

    canvas : undefined,
    paper : new paper.PaperScope(),
    socket : undefined,

    controllers: [
        'Canvas',
        'Tools',
    ],
    launch: function() {
        
        createLayout(); // See app/view/layout.js
        
        var socket = io.connect();
        this.socket = socket;
        socket.on('connect', function () {
            console.log("socket.io connection established");
            socket.on('news', function (data) {
                console.log(data);
                socket.emit('my other event', { my: 'data' });
            });
        });
    }
});
