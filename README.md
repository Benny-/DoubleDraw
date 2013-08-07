DoubleDraw
=============

DoubleDraw allows multiple people to work collaboratively on a vector drawing.

## Installing and running

The server-side is written in javascript and requires Nodejs and npm.

### Dependecies:

- cairo-dev (`sudo apt-get install cairo-dev`, `brew install cairo`)
- extjs 4 - [sencha.com/products/extjs/download/](http://www.sencha.com/products/extjs/download/)

Extract extjs and put the directory in ./public/

The following dependecies are included in this repo and do not need to be downloaded:

- http://paperjs.org/
- https://github.com/eligrey/Blob.js
- https://github.com/eligrey/canvas-toBlob.js
- https://github.com/eligrey/FileSaver.js
- http://www.digitalmagicpro.com/jPicker/
- http://jquery.com/ required for jPicker

### Cloud9

You might need to compile pixman and cairo if you run the software on cloud9:

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

# Somebody at cairo messed up and you need to run this to unmess it:
ln -s ~/custom_installs/include/cairo/ ~/custom_installs/include/cairo/cairo

# You can now perform "npm install". Make sure you do it in the correct directory.
```

### Running

Perform `npm install` to install all Nodejs dependecies, this needs to be done once. Perform `npm start` to run the server.

## Roadmap

- User management
- Shared drawning
- Upload picture
- Record/playback
- Save widget layout
- More tools
- Selection
- Operational transformation

## License

All written code is released under WTFPL.

This program uses GPLv3 code (extjs), MIT licensed code and Creative Commons 2.5 licensed code (ntc.js Chirag Mehta, 4 Sep. 2007).
