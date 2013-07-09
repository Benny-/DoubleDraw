var express     = require('express')
  , app         = express()
  , http        = require('http')
  , server      = http.createServer(app)
  , io          = require('socket.io').listen(server)
  , Paper       = require('paper');  // Note: There are two paperjs variants.
                              // One for the browser and one for nodejs.
                              // Functionality they are - almost - the same.
                              // The one for the browser is in ./public
                              // The one for nodejs is located in ./node_modules

var User = require('./User.js');
var SharedPaper = require('./public/app/SharedPaper.js');
var ToolDescription = require('./public/app/model/tools/ToolDescription.js');
require('./public/app/model/tools/toolDescriptions.js');
require('./public/app/model/tools/pencil.js');
require('./public/app/model/tools/clouds.js');
require('./public/app/model/tools/box.js');
require('./public/app/model/tools/circle.js');
require('./public/app/model/tools/ellipse.js');
require('./public/app/model/tools/bezier.js');
require('./public/app/model/tools/select.js');
require('./public/app/model/tools/wormfarm.js');

var sharedPapers = {};

io.set('log level', 1);

app.use(express.compress());
app.use(express.static(__dirname + '/public'));
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
            io.sockets.clients(this.getRoom()).forEach(function(entry) {
                if(entry != socket)
                    entry.volatile.emit(signal, data);
            });
        }
    };
    
    socket.on('user::drawing::color', function (color) {
        // TODO: sanitize data from client.
        socket.broadcastRoom('user::drawing::color', { user_id : socket.user.user_id, color:color } );
        sharedPapers[this.getRoom()].colorChange(socket.user.user_id, color);
    });
    
    socket.on('user::drawing::selection', function (selection) {
        // TODO: sanitize data from client.
        socket.broadcastRoom('user::drawing::selection', { user_id : socket.user.user_id, selection:selection } );
        sharedPapers[this.getRoom()].selectionChange(socket.user.user_id, selection);
    });
    
    socket.on('user::drawing::tool::change', function (tool) {
        // TODO: sanitize data from client.
        socket.broadcastRoom('user::drawing::tool::change', { user_id : socket.user.user_id, tool : tool } );
        sharedPapers[this.getRoom()].userToolChange(socket.user.user_id, tool);
    });
    
    socket.on('user::drawing::tool::event', function (toolevent) {
        // TODO: sanitize data from client.
        
        toolevent.user_id = socket.user.user_id;
        if(toolevent.type == 'mousemove')
            // Movement is not a essential component of the system. It is therefore a volatile action.
            socket.volatileBroadcastRoomOthers('user::drawing::tool::event', toolevent);
        else
            socket.broadcastRoom('user::drawing::tool::event', toolevent);
        sharedPapers[this.getRoom()].userToolEvent(toolevent.user_id, toolevent);
    });
    
    socket.on('user::drawing::move::offscreen', function () {
        socket.broadcastRoom('user::drawing::move::offscreen', {user_id : socket.user.user_id} );
    });
    
    socket.on('user::chat', function (text) {
        // TODO: sanitize data from client.
        socket.broadcastRoom('user::chat', text );
    });
    
    socket.on('room::enter', function(roomName)
    {
        // TODO: sanitize data from client.
        if(socket.inRoom())
        {
            socket.broadcastRoom('room::user::leave', {user_id : socket.user.user_id} );
            socket.leave(socket.getRoom());
        }
        
        io.sockets.in(roomName).emit('room::user::new', socket.user.exportJSON() );
        
        var sharedPaper;
        if(!sharedPapers[roomName])
        {
            console.log("Creating new shared paper for room "+roomName)
            var canvas              = new Paper.Canvas(200,200);
            var paperscope          = new Paper.PaperScope();
            paperscope.setup(canvas);
            sharedPaper             = new SharedPaper(paperscope);
            sharedPapers[roomName]  = sharedPaper;
            for (var i = 0; i < ToolDescriptions.length; i++) {
                sharedPaper.addToolDescription(ToolDescriptions[i]);
            }
        }
        else
        {
            sharedPaper = sharedPapers[roomName];
        }
            
        sharedPaper.addUser( socket.user )
        
        var users = [];
        for (var i = 0; i < io.sockets.clients(roomName).length; i++) {
            users.push(io.sockets.clients(roomName)[i].user.exportJSON());
        }
        socket.join(roomName);
        socket.emit('room::entered',{
                roomName        : roomName,
                users           : users,
                user            : socket.user.exportJSON(),
                paper_project   : sharedPaper.getPaperScope().project.exportJSON(),
        });
    });
    
    socket.on('disconnect', function () {
        socket.broadcastRoom('room::user::leave', {user_id : socket.user.user_id} );
        // Consider removing the sharedPaper if there are no more users in a particular room.
    });
});
