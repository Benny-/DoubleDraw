
Additional dependecies:
extjs http://www.sencha.com/products/extjs/download/

You might need to compile pixman and cairo if you run the software on cloud9

If you dont't run this app in cloud9, you will need to replace process.env.PORT in server.js by a port number. Most likely 80 or 8080. The second parameter (process.env.IP) can be removed.

TODO:
    chat
    user management
    shared drawning
    upload picture
    Record/playback
    export
    save in paperjs format
    save local palette
    save widget layout