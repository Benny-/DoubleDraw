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

var User = require('./User.js');

io.set('log level', 1);

app.use(express.compress());
app.use(express.static(__dirname + '/client'));
server.listen(process.env.PORT, process.env.IP);

io.sockets.on('connection', function (socket) {
    socket.user = new User(socket);
    
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
    
    // Broadcast a message to everyone in the room.
    socket.broadcastRoom = function(signal, data)
    {
        if(socket.inRoom())
        {
            io.sockets.volatile.in(socket.getRoom()).emit(signal, data);
        }
    };
    
    // Broadcast a message to all OTHERS in the same room.
    socket.volatileBroadcastRoomOthers = function(signal, data)
    {
        if(socket.inRoom())
        {
            io.sockets.volatile.clients(this.getRoom()).forEach(function(entry) {
                if(entry != socket)
                    entry.emit(signal, data);
            });
        }
    };
    
    socket.on('user::tool::change', function (tool) {
        // TODO: sanitize data from client.
        socket.broadcastRoom('user::tool::change', { tool : tool, user_id : socket.user.user_id} );
    });
    
    socket.on('user::tool::onMouseDown', function (json_event) {
        // TODO: sanitize data from client.
        json_event.user_id = socket.user.user_id;
        socket.broadcastRoom('user::tool::onMouseDown', json_event );
    });
    
    socket.on('user::tool::onMouseDrag', function (json_event) {
        // TODO: sanitize data from client.
        json_event.user_id = socket.user.user_id;
        socket.broadcastRoom('user::tool::onMouseDrag', json_event );
    });
    
    socket.on('user::tool::onMouseUp', function (json_event) {
        // TODO: sanitize data from client.
        json_event.user_id = socket.user.user_id;
        socket.broadcastRoom('user::tool::onMouseUp', json_event );
    });
    
    // user::move is not a essential component of the system. It is therefore a volatile action.
    socket.on('user::move', function (point) {
        // TODO: sanitize data from client.
        socket.volatileBroadcastRoomOthers('user::move', {point : point, user_id : socket.user.user_id} );
    });
    
    socket.on('user::move::offscreen', function () {
        socket.broadcastRoom('user::move::offscreen', {user_id : socket.user.user_id} );
    });
    
    socket.on('user::chat', function (text) {
        // TODO: sanitize data from client.
        socket.broadcastRoom('user::chat', text );
    });
    
    socket.on('room::enter', function(room)
    {
        // TODO: sanitize data from client.
        if(socket.inRoom())
        {
            socket.broadcastRoom('room::user::leave', {user_id : socket.user.user_id} );
            socket.leave(socket.getRoom());
        }
        
        io.sockets.in(room).emit('room::user::new', socket.user.exportJSON() );
        
        var users = [];
        for (var i = 0; i < io.sockets.clients(room).length; i++) {
            users.push(io.sockets.clients(room)[i].user.exportJSON());
        }
        socket.join(room);
        socket.emit('room::entered',{
                room : room,
                users : users,
                user : socket.user.exportJSON()
        });
    });
    
    socket.on('disconnect', function () {
        socket.broadcastRoom('room::user::leave', {user_id : socket.user.user_id} );
    });
});
