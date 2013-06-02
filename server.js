var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , paper = require('paper')  // Note: There are two paperjs variants.
                              // One for the browser and one for nodejs.
                              // Functionality they are the same.
                              // The one for the browser is in ./Client
                              // The one for nodejs is located in ./node_modules

io.set('loglevel',0)

app.use(express.compress());
app.use(express.static(__dirname + '/client'));
server.listen(process.env.PORT, process.env.IP);

io.sockets.on('connection', function (socket) {
    console.log("New socket.io connection. More friends! yay");
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});
