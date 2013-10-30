
// Init the color picker.
$.fn.jPicker.defaults.images.clientPath='/resources/images/jpicker/';

// Make sure extjs windows can't move offscreen. That would be inconvenient.
Ext.override(Ext.Window, {
    constrainHeader:true
});

Ext.application({
    name: 'DD', // DoubleDraw
    appFolder : '/app',

    canvas : null,
    paper : new paper.PaperScope(),
    sharedPaperUser : null,
    socket : null,
    roomname : '',

    controllers: [
        'Drawing',
        'Users',
        'Menu',
        'Connection',
    ],
    
    launch: function() {
        var me = this;
        me.roomName = initialServerVars.roomName;
        
        createLayout(); // See /public/app/view/layout.js
        
        var socket = io.connect();
        this.socket = socket;
        
        // The following events from the server are converted to app-wide events:
        var serverEvents = [
            'user::chat',
            'user::drawing::color',
            'user::drawing::tool::change',
            'user::drawing::tool::event',
            'user::drawing::move::offscreen',
            'user::drawing::layer::add',
            'user::drawing::layer::activate',
            'room::entered',
            'room::user::leave',
            'room::user::new',
        ];
        
        serverEvents.forEach( function(eventName, index, array) {
            socket.on(eventName, function () {
            
                // Convert 'arguments' to a real array
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/arguments
                var args = Array.prototype.slice.call(arguments);
                
                // Convert the socket.io event from the server to a extjs app-wide event.
                // Any extjs controller can subscribe to these events.
                me.fireEvent.apply(me, [eventName].concat(args) );
            });
        });
        
        socket.on('connect', function () {
            console.log("socket.io connection established");
            
            var preferred_user = {
                nickname: 'Anonymous'
            };
            
            var roomName = me.roomName;
            console.log("Requesting to enter room "+roomName);
            socket.emit('room::enter', {roomName:roomName, preferred_user:preferred_user} );
            me.fireEvent("server::connect");
        });
        
        this.on("room::entered", function(roomState) {
            console.log("Entered room: ", roomState.roomName, roomState);
        });
        
        socket.on('disconnect', function () {
            console.log("Connection to the DD server is lost");
            me.fireEvent("server::disconnect");
        });
    },
});

