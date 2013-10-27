var express     = require('express');
var app         = express();
var http        = require('http');
var server      = http.createServer(app);
var io          = require('socket.io').listen(server);
var paper       = require('paper');  // Note: There are two paperjs variants.
                              // One for the browser and one for nodejs.
                              // Functionality they are - almost - the same.
                              // The one for the browser is in ./public
                              // The one for nodejs is located in ./node_modules
var repl        = require("repl");
var path        = require('path');

// Project specific requires.
var SharedPaper       = require('./public/app/SharedPaper.js');
var ToolDescription   = require('./public/app/model/tools/ToolDescription.js');
var ToolDescriptions  = require('./public/app/model/tools/toolDescriptions.js');
                        require('./public/app/model/tools/pencil.js');
                        require('./public/app/model/tools/clouds.js');
                        require('./public/app/model/tools/box.js');
                        require('./public/app/model/tools/circle.js');
                        require('./public/app/model/tools/ellipse.js');
                        require('./public/app/model/tools/bezier.js');
                        require('./public/app/model/tools/select.js');
                        require('./public/app/model/tools/wormfarm.js');
                        require('./public/app/model/tools/edit.js');
                        require('./public/app/model/tools/text.js');

// Global variables.
var sharedPapers = {};

io.set('log level', 1);
app.set('port', process.env.PORT || 4100);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('case sensitive routing', true);
app.set('strict routing', true);
app.use(express.compress());
app.use(express.static(__dirname + '/public'));

if ('development' == app.get('env')) {
    app.use(express.logger('dev'));
    app.use(express.errorHandler());
    
    // The run execute programming loop is used for debugging or messing around.
    var local_console = repl.start({
      prompt: "> ",
      input: process.stdin,
      output: process.stdout,
    });
    local_console.context.sharedPapers = sharedPapers;
    local_console.context.server = server;
    local_console.context.app = app;
    local_console.context.io = io;
}

app.param('roomName', function(req, res, next) {
    req.roomName = req.url.split("/")[2];
    req.sharedPaper = sharedPapers[req.roomName]; // req.sharedPaper is allowed to be null
    if(!req.roomName)
        next(new Error('Invalid room name.'));
    else
        next();
});

app.get("/room/", function(req, res) {
    res.send(400, 'Invalid room name.');
    res.end();
});

app.get("/room/:roomName", function(req, res) {
    res.render('room', { roomName:req.roomName });
    res.end();
});

app.get("/room/:roomName/snapshot.png", function(req, res) {
    if(req.sharedPaper)
    {
        var view = req.sharedPaper.getPaperScope().view;
        var canvas = view.element;
        view.draw();
        var stream = stream = canvas.pngStream();
        
        res.writeHead(200, {'Content-Type': 'image/png' });
        stream.on('data', function(chunk){
            res.write(chunk);
        });

        stream.on('end', function(){
            res.end();
        });
    }
    else
    {
        res.send(500, 'Room does not exist');
        res.end();
    }
});

app.get("/room/:roomName/snapshot.svg", function(req, res) {
    if(req.sharedPaper)
    {
        var paperProject = req.sharedPaper.getSharedProject();
        var serializer= new paper.XMLSerializer();
        var svg = paperProject.exportSVG();
        var svg_string = serializer.serializeToString(svg);
        
        res.writeHead(200, {'Content-Type': 'image/svg+xml' });
        res.write( svg_string );
        res.end();
    }
    else
    {
        res.send(500, 'Room does not exist');
        res.end();
    }
});

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
    
    socket.on('user::drawing::layer::add', function () {
        if(this.inRoom())
        {
            socket.broadcastRoom('user::drawing::layer::add', socket.user_id );
            sharedPapers[this.getRoom()].addLayer(socket.user_id);
        }
    });
    
    socket.on('user::drawing::layer::activate', function (layer) {
        // TODO: sanitize data from client.
        
        if(this.inRoom())
        {
            socket.broadcastRoom('user::drawing::layer::activate', {user_id:socket.user_id, layer:layer} );
            sharedPapers[this.getRoom()].activateLayer(socket.user_id, layer);
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
            console.log("Creating new SharedPaper for room", roomName)
            var canvas              = new paper.Canvas(800,600);
            var paperscope          = new paper.PaperScope();
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

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

