
/*
The following app-wide events can be generated:
* user::tool::event     A event generated if some player performed a action using there tool
* user::move::offscreen If a players cursor moved offscreen
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

Ext.override(Ext.Window, {
    constrainHeader:true
});

Ext.application({
    name: 'DD', // DoubleDraw
    appFolder : 'app',

    canvas : null,
    paper : new paper.PaperScope(),
    socket : null,
    roomname : '',

    controllers: [
        'Drawing',
        'Users',
        'Menu',
    ],
    launch: function() {
        
        createLayout(); // See app/view/layout.js
        
        var app = this;
        
        Ext.create('DD.view.ColorPicker', {
            
        }).show();
        
        var socket = io.connect();
        this.socket = socket;
        socket.on('connect', function () {
            console.log("socket.io connection established");
            if(window.location.hash != '')
            {
                console.log("Requesting to enter room "+window.location.hash);
                socket.emit('room::enter', window.location.hash );
            }
            else
            {
                console.log("No room specified, joining #default.")
                socket.emit('room::enter', "#default" );
            }
        });
        
        socket.on('user::tool::change', function (toolChange) {
            app.fireEvent("user::tool::change", toolChange);
        });
        
        socket.on('user::tool::event', function (event) {
            app.fireEvent("user::tool::event", event);
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
        
        socket.on('room::entered', function (roomState) {
            window.location.hash = roomState.roomName;
            app.fireEvent("room::entered", roomState);
        });
        
    }
});
