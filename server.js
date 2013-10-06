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

var repl        = require("repl");

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
require('./public/app/model/tools/edit.js');

var sharedPapers = {};

io.set('log level', 1);

app.use(express.compress());
app.use(express.static(__dirname + '/public'));
server.listen(process.env.PORT, process.env.IP);

console.log("Server is running on http://"+server.address().address+":"+server.address().port)

var next_user_id = 1;
io.sockets.on('connection', function (socket) {
    socket.user_id = next_user_id++;
    
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
        
        if(this.inRoom())
        {
            socket.broadcastRoom('user::drawing::color', { user_id : socket.user_id, color:color } );
            sharedPapers[this.getRoom()].colorChange(socket.user_id, color);
        }
    });
    
    socket.on('user::drawing::tool::change', function (tool) {
        // TODO: sanitize data from client.
        
        if(this.inRoom())
        {
            socket.broadcastRoom('user::drawing::tool::change', { user_id : socket.user_id, tool : tool } );
            sharedPapers[this.getRoom()].userToolChange(socket.user_id, tool);
        }
    });
    
    socket.on('user::drawing::tool::event', function (toolevent) {
        // TODO: sanitize data from client.
        
        if(this.inRoom())
        {
            toolevent.user_id = socket.user_id;
            if(toolevent.type == 'mousemove')
                // Movement is not a essential component of the system. It is therefore a volatile action.
                socket.volatileBroadcastRoomOthers('user::drawing::tool::event', toolevent);
            else
                socket.broadcastRoom('user::drawing::tool::event', toolevent);
            sharedPapers[this.getRoom()].userToolEvent(toolevent.user_id, toolevent);
        }
    });
    
    socket.on('user::drawing::move::offscreen', function () {
        if(this.inRoom())
            socket.broadcastRoom('user::drawing::move::offscreen', {user_id : socket.user_id} );
    });
    
    socket.on('user::chat', function (message) {
        // TODO: sanitize data from client.
        
        if(this.inRoom())
        {
            message.processedDate = new Date();
            message.user_id = socket.user_id;
            message.nickname = sharedPapers[socket.getRoom()].getUser(socket.user_id).nickname;
            socket.broadcastRoom('user::chat', message );
        }
    });
    
    // preferred_user contains things like preferred nickname.
    socket.on('room::enter', function(room_enter)
    {
        var roomName = room_enter.roomName;
        var preferred_user = room_enter.preferred_user;
        
        // TODO: sanitize data from client.
        if(socket.inRoom())
        {
            socket.broadcastRoom('room::user::leave', {user_id : socket.user_id} );
            sharedPapers[socket.getRoom()].removeUser(socket.user_id);
            socket.leave(socket.getRoom());
        }
        
        var sharedPaper;
        if(!sharedPapers[roomName])
        {
            console.log("Creating new shared paper for room", roomName)
            var canvas              = new Paper.Canvas(200,200);
            var paperscope          = new Paper.PaperScope();
            paperscope.setup(canvas);
            sharedPaper = sharedPapers[roomName] = new SharedPaper(paperscope, ToolDescriptions);
        }
        else
        {
            sharedPaper = sharedPapers[roomName];
        }
        
        preferred_user.user_id = socket.user_id;
        sharedPaper.addUser( preferred_user )
        var userDrawContext = sharedPaper.getUser(socket.user_id);
        io.sockets.in(roomName).emit('room::user::new', userDrawContext.export() );
        
        socket.join(roomName);
        socket.emit('room::entered',{
                roomName        : roomName,
                user            : userDrawContext.export(),
                sharedPaper     : sharedPaper.export(),
        });
    });
    
    socket.on('disconnect', function () {
        if(this.inRoom())
        {
            socket.broadcastRoom('room::user::leave', {user_id : socket.user_id} );
            sharedPapers[socket.getRoom()].removeUser(socket.user_id);
        }
        // Consider removing the sharedPaper if there are no more users in a particular room.
    });
});

var local_console = repl.start({
  prompt: "> ",
  input: process.stdin,
  output: process.stdout,
});
local_console.context.sharedPapers = sharedPapers;
local_console.context.server = server;
local_console.context.app = app;
local_console.context.io = io;

