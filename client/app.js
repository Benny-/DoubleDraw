Ext.application({
    name: 'DD', // DoubleDraw

    canvas : undefined,
    paper : new paper.PaperScope(),

    controllers: [
        'Canvas',
        'Tools',
    ],
    launch: function() {
        
        createLayout(); // See app/view/layout.js
        
        var socket = io.connect('http://doubledraw.klasma.c9.io/');
        socket.on('news', function (data) {
            console.log(data);
            socket.emit('my other event', { my: 'data' });
        });
    }
});
