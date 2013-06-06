
/*
The following app-wide events can be generated:
1. PaperReady - Only signalled once if paperjs can be used. This event is generated during rendering.
2. All event from the server are converted into app-wide events.

The controllers will listen for these app-wide events and perform proper action. For example:
A new user requests to the server to enter a room. The server sends the "room::user::new" message/event
to all clients in the room. The received message is put on the extjs event bus with the same name.
The Users controller listens for "room::user::new" and adds the user to the Users's datastore. All
related gui's who use the datastore will show the newly added user.
*/

Ext.application({
    name: 'DD', // DoubleDraw
    appFolder : 'app',

    canvas : null,
    paper : new paper.PaperScope(),
    socket : null,
    roomname : '',

    controllers: [
        'Canvas',
        'Tools',
        'Users',
        'Menu',
    ],
    launch: function() {
        
        createLayout(); // See app/view/layout.js
        
        var app = this;
        
        var socket = io.connect();
        this.socket = socket;
        socket.on('connect', function () {
            console.log("socket.io connection established");
            if(window.location.hash != '')
            {
                console.log("Requesting to enter room");
                socket.emit('room::enter', window.location.hash );
            }
            else
            {
                console.log("No room specified, joining #default.")
                socket.emit('room::enter', "#default" );
            }
        });
        
        socket.on('user::tool::change', function (tool_change) {
            app.fireEvent("user::tool::change", tool_change);
        });
        
        socket.on('user::tool::onMouseDown', function (json_event) {
            app.fireEvent("user::tool::onMouseDown", json_event);
        });
        
        socket.on('user::tool::onMouseDrag', function (json_event) {
            app.fireEvent("user::tool::onMouseDrag", json_event);
        });
        
        socket.on('user::tool::onMouseUp', function (json_event) {
            app.fireEvent("user::tool::onMouseUp", json_event);
        });
        
        socket.on('user::move', function (movement) {
            app.fireEvent("user::move", movement);
        });
        
        socket.on('user::move::offscreen', function (user) {
            app.fireEvent("user::move::offscreen", user);
        });
        
        socket.on('room::user::leave', function (user) {
            app.fireEvent("room::user::leave", user);
        });
        
        socket.on('room::user::new', function (user) {
            app.fireEvent("room::user::new", user);
        });
        
        socket.on('room::entered', function (room_state) {
            window.location.hash = room_state.room;
            app.fireEvent("room::entered", room_state);
        });
        
    }
});
