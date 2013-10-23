
/*
The following app-wide events can be generated:
* user::drawing::tool::event     A event generated if some player performed a action using there tool
* user::drawing::move::offscreen If a players cursor moved offscreen
* room::user:new        If a new player enters the room
* room:user:leave       If a player leaves the room
* room::entered         Send to the player who enters a new room. This event contains the whol room state

The controllers will listen for these app-wide events and perform proper action. For example:
A new user requests to the server to enter a room. The server sends the "room::user::new" message/event
to all clients in the room. The received message is put on the extjs event bus with the same name.
The Users controller listens for "room::user::new" and adds the user to the Users's datastore. All
related gui's who use the datastore will show the newly added user. The drawing controller might start
drawing a cursor for the new user. ect...
*/

// Init the color picker.
$.fn.jPicker.defaults.images.clientPath='resources/images/jpicker/';

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
    ],
    
    launch: function() {
        var me = this;
        me.roomName = initialServerVars.roomName;
        
        createLayout(); // See /public/app/view/layout.js
        
        var socket = io.connect();
        this.socket = socket;
        socket.on('connect', function () {
            console.log("socket.io connection established");
            
            var preferred_user = {
                nickname: 'Anonymous'
            };
            
            var roomName = me.roomName;
            console.log("Requesting to enter room "+roomName);
            socket.emit('room::enter', {roomName:roomName, preferred_user:preferred_user} );
        });
        
        socket.on('room::entered', function (roomState) {
            console.log("Entered room: ", roomState.roomName, roomState);
            me.fireEvent("room::entered", roomState);
        });
        
        socket.on('user::chat', function (message) {
            me.fireEvent("user::chat", message);
        });
        
        socket.on('user::drawing::color', function (data) {
            me.fireEvent("user::drawing::color", data);
        });
        
        socket.on('user::drawing::selection', function (data) {
            me.fireEvent("user::drawing::selection", data);
        });
        
        socket.on('user::drawing::tool::change', function (data) {
            me.fireEvent("user::drawing::tool::change", data);
        });
        
        socket.on('user::drawing::tool::event', function (event) {
            me.fireEvent("user::drawing::tool::event", event);
        });
        
        socket.on('user::drawing::move::offscreen', function (user) {
            me.fireEvent("user::drawing::move::offscreen", user);
        });
        
        socket.on('room::user::leave', function (user) {
            me.fireEvent("room::user::leave", user);
        });
        
        socket.on('room::user::new', function (user) {
            me.fireEvent("room::user::new", user);
        });
        
        socket.on('disconnect', function () {
            console.log("Connection to the mothership lost");
        });
        
    }
});
