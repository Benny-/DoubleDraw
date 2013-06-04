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

io.set('loglevel',0);

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
        var rooms = io.sockets.manager.roomClients[socket.id];
        Object.keys(rooms).forEach(function (room) {
            if(room.charAt(0) == '/')
            {
                return room.substring(1);
            }
        });
        return null; // This socket is not in any room.
    };
    
    socket.inRoom = function()
    {
        return socket.getRoom() !== null;
    };
    
    socket.on('user::tool::select', function (tool) {
        // TODO: sanitize data from client.
    });
    
    socket.on('user::tool::settings', function (tool) {
        // TODO: sanitize data from client.
    });
    
    // user::move is not a essential component of the system. It is therefore a volatile action.
    socket.on('user::move', function (point) {
        // TODO: sanitize data from client.
        if(socket.inRoom())
            io.sockets.volatile.in(socket.room).emit('user::move', {movements : point, user_id : socket.user.user_id} );
    });
    
    socket.on('user::move::offscreen', function () {
        if(socket.inRoom())
            io.sockets.in(socket.getRoom()).emit('user::move::offscreen', {user_id : socket.user.user_id} );
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
        io.sockets.in(socket.room).emit('room::user::leave', {user_id : socket.user.user_id} );
    });
});
