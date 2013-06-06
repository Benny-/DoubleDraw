var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , paper = require('paper');  // Note: There are two paperjs variants.
                              // One for the browser and one for nodejs.
                              // Functionality they are the same.
                              // The one for the browser is in ./Client
                              // The one for nodejs is located in ./node_modules

io.set('log level', 1);

app.use(express.compress());
app.use(express.static(__dirname + '/client'));
server.listen(process.env.PORT, process.env.IP);

// Every user gets a unique id.
// This is used to replay every user's actions correctly on every client.
// The server only passes this value to other clients.
var next_user_id = 1;

io.sockets.on('connection', function (socket) {
    socket.user = {};
    socket.user.user_id = next_user_id++;
    
    socket.getRoom = function()
    {
        var rooms = Object.keys(io.sockets.manager.roomClients[socket.id]);
        for (var i=0; i<rooms.length; i++)
        {
            var room = rooms[i];
            if(room.charAt(0) == '/')
            {
                return room.substring(1);
            }
        }
        return null; // This socket/user is not in any room.
    };
    
    socket.inRoom = function()
    {
        return socket.getRoom() !== null;
    };
    
    // Broadcast a message to all others in the same room.
    socket.broadcastRoom = function(signal, data)
    {
        io.sockets.clients(this.getRoom()).forEach(function(entry) {
            if(entry != socket)
                entry.emit(signal, data);
        });
    };
    
    socket.volatileBroadcastRoom = function(signal, data)
    {
        io.sockets.volatile.clients(this.getRoom()).forEach(function(entry) {
            if(entry != socket)
                entry.emit(signal, data);
        });
    };
    
    socket.on('user::tool::change', function (tool) {
        // TODO: sanitize data from client.
        if(socket.inRoom())
            io.sockets.volatile.in(socket.getRoom()).emit('user::tool::change', { tool : tool, user_id : socket.user.user_id} );
    });
    
    socket.on('user::tool::onMouseDown', function (json_event) {
        // TODO: sanitize data from client.
        json_event.user_id = socket.user_id;
        if(socket.inRoom())
            io.sockets.volatile.in(socket.getRoom()).emit('user::tool::onMouseDown', json_event );
    });
    
    socket.on('user::tool::onMouseDrag', function (json_event) {
        // TODO: sanitize data from client.
        json_event.user_id = socket.user_id;
        if(socket.inRoom())
            io.sockets.volatile.in(socket.getRoom()).emit('user::tool::onMouseDrag', json_event );
    });
    
    socket.on('user::tool::onMouseUp', function (json_event) {
        // TODO: sanitize data from client.
        json_event.user_id = socket.user_id;
        if(socket.inRoom())
            io.sockets.volatile.in(socket.getRoom()).emit('user::tool::onMouseUp', json_event );
    });
    
    // user::move is not a essential component of the system. It is therefore a volatile action.
    socket.on('user::move', function (point) {
        // TODO: sanitize data from client.
        if(socket.inRoom())
            socket.volatileBroadcastRoom('user::move', {point : point, user_id : socket.user.user_id} );
    });
    
    socket.on('user::move::offscreen', function () {
        if(socket.inRoom())
            io.sockets.in(socket.getRoom()).emit('user::move::offscreen', {user_id : socket.user.user_id} );
    });
    
    socket.on('user::chat', function (text) {
        // TODO: sanitize data from client.
        if(socket.inRoom())
            io.sockets.volatile.in(socket.getRoom()).emit('user::chat', text );
    });
    
    socket.on('room::enter', function(room)
    {
        // TODO: sanitize data from client.
        if(socket.inRoom())
        {
            io.sockets.in(socket.getRoom()).emit('room::user::leave', {user_id : socket.user.user_id} );
            socket.leave(socket.getRoom());
        }
        
        io.sockets.in(room).emit('room::user::new', {user_id : socket.user.user_id} );
        
        var users = [];
        for (var i = 0; i < io.sockets.clients(room).length; i++) {
            var another_user_socket = io.sockets.clients(room)[i];
            users.push(another_user_socket.user);
        }
        socket.join(room);
        socket.emit('room::entered', {room : room, users : users } );
    });
    
    socket.on('disconnect', function () {
        io.sockets.in(socket.getRoom()).emit('room::user::leave', {user_id : socket.user.user_id} );
    });
});
