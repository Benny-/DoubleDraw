DoubleDraw
=============

DoubleDraw allows multiple people to work collaboratively on a vector drawing.

## Installing and running

The server-side is written in JavaScript. It requires [NodeJs](http://nodejs.org/) and npm (npm comes with NodeJs).

### Dependecies:

- cairo-dev (`sudo apt-get install libcairo2-dev`, `brew install cairo`, see below for installation on cloud9)

The following dependencies are included in this repo and do not need to be downloaded:

- http://paperjs.org/
- https://github.com/eligrey/Blob.js
- https://github.com/eligrey/canvas-toBlob.js
- https://github.com/eligrey/FileSaver.js
- http://www.digitalmagicpro.com/jPicker/
- http://jquery.com/ required for jPicker
- http://www.sencha.com/products/extjs (The public CDN is used)

`npm install` for all other external dependencies.

### Cloud9

You might need to compile pixman and cairo to run DoubleDraw on cloud9:

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

```bash
npm start
```

## Roadmap

- User management
- Layers
- Upload picture
- Record/playback
- Save widget layout
- More tools
- Selection
- Operational transformation

## Contact

For bugs and feature requests you should make a [ticket](https://github.com/Benny-/DoubleDraw/issues). Please check if there issent already a ticket open.

For questions you can send a email or join in on irc: room `#DoubleDraw` on `irc.freenode.net`. For convenience you can join using [webchat](https://webchat.freenode.net/?channels=DoubleDraw).

## License

All written code is released under [WTFPL](http://www.wtfpl.net/).

This program uses GPLv3 code (extjs), MIT licensed code and Creative Commons 2.5 licensed code (ntc.js Chirag Mehta, 4 Sep. 2007).

