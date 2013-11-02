DoubleDraw
=============

DoubleDraw allows multiple people to work collaboratively on a vector drawing. A possible outdated or unstable example may or may not run [here](http://dd.bennyjacobs.nl:5100/). This project aims to create a pure html5 vector editor as a response to Microsoft's decision to disallow any native applications in the next version of windows™.

<!-- Ok, that part about windows was a lie. This project is aims double the fun! -->

## Installing and running

The server-side is written in JavaScript. It requires [NodeJs](http://nodejs.org/) and npm (npm comes with NodeJs).

### Dependencies:

- cairo-dev (`sudo apt-get install libcairo2-dev libgif-dev`, `brew install cairo`, see below for installation on cloud9)

For downloading all nodejs dependencies into `./node_modueles/`:

```bash
npm install
```

The following dependencies are included in this repo and do not need to be downloaded:

- http://paperjs.org/about/
- https://github.com/eligrey/Blob.js
- https://github.com/eligrey/canvas-toBlob.js
- https://github.com/eligrey/FileSaver.js
- http://www.digitalmagicpro.com/jPicker/
- http://jquery.com/ (required for jPicker)
- http://www.sencha.com/products/extjs (The public CDN is used)

### Cloud9

You might need to compile pixman and cairo to run DoubleDraw on [cloud9](https://c9.io/):

```bash
mkdir ~/custom_installs

cd;
wget http://cairographics.org/releases/pixman-0.30.0.tar.gz
tar xvzf ./pixman-0.30.0.tar.gz
cd pixman-0.30.0
./configure --prefix ~/custom_installs/ && make && make install
cd;
rm -rf pixman-0.30.0/
rm pixman-0.30.0.tar.gz

# Append the following line to your ~/.bashrc file and restart bash (run 'exit').
export PKG_CONFIG_PATH="$PKG_CONFIG_PATH:$(echo ~/custom_installs/lib/pkgconfig)";

cd;
wget http://cairographics.org/releases/cairo-1.12.14.tar.xz
unxz -c ./cairo-1.12.14.tar.xz | tar xv
cd ./cairo-1.12.14
./configure --prefix ~/custom_installs/ && make && make install
cd;
rm -rf cairo-1.12.14/
rm cairo-1.12.14.tar.xz

# The include directories are not set correctly on this version of cairo.
# This is one way to fix it:
ln -s ~/custom_installs/include/cairo/ ~/custom_installs/include/cairo/cairo

# You can now perform "npm install". Make sure you do it in the correct directory.
```

### Running

Start the server:

```bash
npm start
```

Access the server using any modern browser:

- IE9 (or better)
- Firefox
- Chromium
- Opera

## Roadmap

- User management
- User's cursors visible
- Layers
- Upload picture
- Record/playback
- Save widget layout
- Ensure consistent canvas (checksums)
- More tools
- Selection (deleting and moving drawings)
- Operational transformation
- Icons in user interface

## Code

This chapter is mainly for reading the code and hacking.

[Paper.js](http://paperjs.org/about/) is an open source vector graphics scripting framework that runs on top of the HTML5 Canvas. When we draw using paper.js we will refer to it as drawing on "the paper".

The clients send mouse inputs (click/drag/release) events to the server. The server redistributes the events to all (including the sender) clients. The events are processed on all parties by a tool which knows what transformations (create path, edit, ect..) it should apply to the paper. All clients process the same events in the same order, this ensures a consistent paper across all parties. The server contains a paper too, this is serialized and send if a new user joins a room. A consequence of this setup is the round trip before any of your inputs show any effect on your paper.

The public folder contains all the client related code and resources. It is organized according to [extjs MVC structure](http://docs.sencha.com/extjs/#!/guide/application_architecture).

The server part is rather simply and is actually a small portion of the total code base. Its primary purposes:

- Receive events and re-transmit them to all clients.
- Process those events using a tool on a local paper.
- Send paper if a new client joins a room.

The following code is shared between the server and the client for processing events and drawing on the local paper:

- public/app/SharedPaper.js
- public/app/UserDrawContext.js
- public/app/model/tools/*

## Contact

For bugs and feature requests you should make a [ticket](https://github.com/Benny-/DoubleDraw/issues). Please check if there issent already a ticket open about the same issue.

For questions or offering help of any kind (programming, graphics, testers, advice) you can send a email or join on irc: room `#DoubleDraw` on `irc.freenode.net`. For convenience you can join using [webchat](https://webchat.freenode.net/?channels=DoubleDraw).

## License

All written code is released under [WTFPL](http://www.wtfpl.net/).

This program uses GPLv3 code (extjs), MIT licensed code and Creative Commons 2.5 licensed code (ntc.js Chirag Mehta, 4 Sep. 2007).

