
Additional dependecies:
extjs http://www.sencha.com/products/extjs/download/

You might need to compile pixman and cairo if you run the software on cloud9

You need to alter the url for websocket to work correctly:
var socket = io.connect('http://your.url.com/');

If you dont't run this app in cloud9, you will need to replace process.env.PORT in server.js by a port number. Most likely 80 or 8080. The second parameter (process.env.IP) can be removed.
