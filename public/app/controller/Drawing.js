
Ext.define('DD.controller.Drawing', {
    extend: 'Ext.app.Controller',
    
    sharedPaperUser: null,
    colorSelectionPrimary: null,
    colorSelectionSecondary: null,
    
    primaryColor: null,
    secondaryColor: null,
    mouseOverCanvas: false,
    
    stores: [
        'Palettes',
        'ActivePalettes',
        'PaperItems',
    ],
    
    views: [
        'Canvas',
        'Tools',
        'Palettes',
        'ColorBox',
        'ColorPicker',
        'Layers',
    ],
    
    init: function() {
        var me = this;
        
        this.primaryColor = Ext.create("DD.model.Color",{
            r:221,
            g:31,
            b:209,
            a:0.8
        });
        this.secondaryColor = Ext.create("DD.model.Color",{
            r:249,
            g:54,
            b:0,
            a:0.8
        });
        
        this.primaryColor.on(
            'change',
            function() {
                this.application.socket.emit('user::drawing::color', this.primaryColor.export() );
                this.colorStatusView.setText( this.primaryColor.toHex() );
            },
            this);
        
        this.control({
            'canvas#canvasPanel': {
                render: this.onPanelRendered,
                resize: this.onPanelResize,
                canvasMouseEnter: this.canvasMouseEnter,
                canvasMouseLeave: this.canvasMouseLeave,
            },
            
            'colorbox#colorSelectionPrimary': {
                render: this.onColorSelectionPrimaryRendered,
                click:  this.onColorSelectionPrimaryClick,
            },
            'colorbox#colorSelectionSecondary': {
                render: this.onColorSelectionSecondaryRendered,
                click:  this.onColorSelectionSecondaryClick,
            },
            
            'tools': {
                beforerender: this.toolsInit,
            },
            
            'button#add_palette': {
                click:  this.onAddPalette,
            },
            'button#import_palette': {
                click:  this.importPalette,
            },
            'button#reset_palettes': {
                click:  this.resetPalettes,
            },
            
            'palettes#allPalettes tool[type=pin]': {
                click:  this.pinPalette,
            },
            
            'palettes#allPalettes tool[type=plus]': {
                click:  this.paletteAddColor,
            },
            
            'palettes#allPalettes tool[type=close]': {
                click:  this.deletePalette,
            },
            
            // Why am I using the editable match on colorBox instead of a parent match?
            // Well, colorBox does not have a parent.
            // Take a look in the DD.view.Palette class.
            // The colorBox is added to the grid in a very odd way. extjs does not
            // seem to support adding extjs components to cells in a grid. So I used
            // a workaround. As a consequence, colorBox is not a direct child of grid.
            'colorbox[editable=true]': {
                click:  this.paletteColorBoxClickEdit,
            },
            
            // XXX: This match should match all the colorboxes in palettes#activePalettes.
            // This is not a fool-proof match (see comment above). It might match future colorboxes in other elements.
            // But for now we can live with it.
            'colorbox[editable=false]': {
                click:  this.paletteColorBoxClickUse,
            },
            
            'palettes#activePalettes tool[type=unpin]': {
                click:  this.unpinPalette,
            },
            
            '#refreshLayers': {
                click:  this.refreshLayers,
            },
            
            '#appendLayer': {
                click:  this.appendLayer,
            },
            
            'layers#layers': {
                itemclick: this.layerItemClick,
            },
            
            'tbtext#positionStatus': {
                render: function(view) {
                    this.positionStatusView = view;
                },
            },
            
            'tbtext#colorStatus': {
                render: function(view) {
                    this.colorStatusView = view;
                    this.colorStatusView.setText( this.primaryColor.toHex() );
                },
            },
            
            'menuitem#file_menu_import_svg': {
                click: function() {
                    console.log("menuitem#file_menu_import_svg: Not implemented");
                },
            },
            
            'menuitem#file_menu_import_raster': {
                click: function() {
                    Ext.Msg.prompt('Import raster', 'Please enter the url of the image.', function(btn, text){
                        if (btn == 'ok') {
                            // TODO: Put some pre-validation here before we send the request to the server.
                            me.application.socket.emit("user::drawing::import::raster", text );
                        }
                    });
                },
            },
            
        });
    },
    
    canvasMouseEnter: function() {
        this.mouseOverCanvas = true;
    },
    
    canvasMouseLeave: function() {
        this.mouseOverCanvas = false;
    },
    
    onPanelRendered: function(panel) {
        var me = this;
        this.application.canvas = document.getElementById('html5_canvas');
        this.application.paper.setup('html5_canvas');
        
        this.application.on("room::entered", function(roomState) {
        
            me.application.socket.emit('user::drawing::color', me.primaryColor.export() );
            
            if( !me.sharedPaperUser )
            {
                me.sharedPaperUser = new Ext.create(
                    'DD.SharedPaperUser',
                    me.application.paper,
                    ToolDescriptions,
                    function(event){
                        var cursorVisibleForOther = true;
                        
                        if(event.point)
                            me.positionStatusView.setText("x " + event.point.x + " y " + event.point.y);
                        
                        // We do not need to send our mousemove events.
                        // They are not essential for a consistent shared canvas.
                        // They will only be used to draw the cursors.
                        if(event.type == 'mousemove')
                        {
                            if(me.mouseOverCanvas)
                            {
                                cursorVisibleForOther = true;
                                me.application.socket.emit("user::drawing::tool::event", event );
                            }
                            else if(cursorVisibleForOther)
                            {
                                // This event will hide our cursor on the other's computer.
                                // The boolean cursorVisibleForOther ensures we do not send unnecessary user::drawing::move::offscreen events.
                                cursorVisibleForOther = false;
                                me.application.socket.emit("user::drawing::move::offscreen");
                            }
                        }
                        else
                        {
                            // All other event types however are essential for a consistent canvas and should always be send.
                            me.application.socket.emit("user::drawing::tool::event", event );
                        }
                    }
                );
            }
            me.application.sharedPaperUser = me.sharedPaperUser;
            me.application.paper.view.draw();
            
            me.sharedPaperUser.import (roomState.sharedPaper);
            me.sharedPaperUser.setUser(roomState.user);
            me.refreshLayers();
            me.application.paper.view.draw();
        });
        
        this.application.on("user::drawing::color", function(data) {
            me.sharedPaperUser.colorChange(data.user_id, data.color);
        });
        
        this.application.on("user::drawing::tool::change", function(data) {
            me.sharedPaperUser.userToolChange(data.user_id, data.tool);
            me.application.paper.view.draw();
        });
        
        this.application.on("user::drawing::tool::event", function(event) {
            me.sharedPaperUser.userToolEvent(event.user_id, event);
            me.application.paper.view.draw();
        });
        
        this.application.on("user::drawing::move::offscreen", function(user) {
            me.sharedPaperUser.offscreen(user.user_id);
            me.application.paper.view.draw();
        });
        
        this.application.on("user::drawing::layer::add", function(user_id) {
            me.sharedPaperUser.addLayer(user_id);
            me.refreshLayers();
        });
        
        this.application.on("user::drawing::layer::activate", function(activateLayer) {
            me.sharedPaperUser.activateLayer(activateLayer.user_id, activateLayer.layer);
            me.refreshLayers();
        });
        
        this.application.on("user::drawing::import::raster", function(raster) {
            me.sharedPaperUser.importRaster(raster.user_id, raster.url);
        });
        
        this.application.on("room::user::leave", function(user) {
            me.sharedPaperUser.removeUser(user.user_id);
            me.application.paper.view.draw();
        });
        
        this.application.on("room::user::new", function(user) {
            me.sharedPaperUser.addUser(user);
            me.application.paper.view.draw();
        });
    },
    
    // The onRezie function resizes the html canvas match the outer container panel.
    onPanelResize: function(container, width, height, oldWidth, oldHeight, eOpts) {
        // XXX: The width and height of the resized container include some decoration.
        // We should include it in our calculation, but I can't seem to find a programic way to obtain that information.
        // This is not portable, the size of the decorations might change.
        // A additional reason this is unportable is if you zoom in.
        this.application.paper.view.setViewSize( {width:width-18, height:height-18} );
    },
    
    onColorSelectionPrimaryRendered: function(colorBox) {
        colorBox.loadColor(this.primaryColor);
    },
    
    onColorSelectionSecondaryRendered: function(colorBox) {
        colorBox.loadColor(this.secondaryColor);
    },
    
    onColorSelectionPrimaryClick: function(colorBox) {
        Ext.create('DD.view.ColorPicker', {
            title: "Change primary drawing color",
            color: this.primaryColor,
        }).show();
    },
    
    onColorSelectionSecondaryClick: function(colorBox) {
        this.primaryColor.swap(this.secondaryColor);
    },
    
    toolsInit: function( component, eOpts ) {
        
        var controller = this;
        ToolDescriptions.forEach( function(toolDescription) {
            var button = Ext.create('Ext.Button', {
                text: toolDescription.name,
                tooluuid: toolDescription.uuid, // Bam! Just slam the tool's uuid onto the button.
                tooltip: toolDescription.description,
                handler: function() {
                    controller.application.socket.emit("user::drawing::tool::change", {
                        uuid : this.tooluuid,
                    });
                }
            });
            component.add(button)
        }, this);
    },
    
    onAddPalette: function() {
        var color = Ext.create('DD.model.Color');
        color.save();
        var palette = Ext.create('DD.model.Palette', {name:'New palette'} );
        palette.save();
        
        palette.colors().add(color);
        color.set("palette_id", palette.get("id"));
        palette.colors().sync();
        
        Ext.getStore('Palettes').add(palette);
        Ext.getStore('Palettes').sync();
    },
    
    importPalette: function() {
        console.log("importPalette()", "TODO: Implement function.");
        // Import would allow one to import a palette in the 
    },
    
    resetPalettes: function() {
        console.log("resetPalettes()", "TODO: Implement function.");
        // Should remove all colors and put some default palettes in it.
    },
    
    pinPalette: function (tool, event) {
        var palette = tool.up('palette').palette;
        
        var ActivePalettes = Ext.getStore('ActivePalettes');
        
        if(!ActivePalettes.getById(palette.get("id"))) // Do not pin if it is already pinned.
        {
            ActivePalettes.add(palette);
            ActivePalettes.sync();
        }
    },
    
    paletteAddColor: function (tool, event) {
        var palette = tool.up('palette').palette;
        
        var newColor = Ext.create("DD.model.Color");
        newColor.save();
        
        palette.colors().add(newColor);
        newColor.set("palette_id", palette.get("id"));
        palette.colors().sync();
        
        var colorPicker = Ext.create('DD.view.ColorPicker', {
            title: "New color for palette "+palette.get("name"),
            color: newColor,
        });
        colorPicker.on("commit", function() {
            this.color.save();
        });
        colorPicker.show();
    },
    
    deletePalette: function (tool, event) {
        var palette = tool.up('palette').palette;
        
        // TODO: Consider showing a confirmation screen.
        
        Ext.getStore('Palettes').remove(palette);
        Ext.getStore('ActivePalettes').remove(palette);
    },
    
    paletteColorBoxClickEdit: function(colorBox) {
        var colorPicker = Ext.create('DD.view.ColorPicker', {
            title: "" + colorBox.color.get("name"),
            color: colorBox.color,
        });
        colorPicker.on("commit", function() {
            colorBox.color.save();
        });
        colorPicker.show();
    },
    
    paletteColorBoxClickUse: function(colorBox) {
        this.primaryColor.loadOther(colorBox.color);
    },
    
    unpinPalette: function (tool, event) {
        var palette = tool.up('palette').palette;
        
        var ActivePalettes = Ext.getStore('ActivePalettes');
        ActivePalettes.remove(palette);
        ActivePalettes.sync();
    },
    
    refreshLayers: function () {
        root = Ext.getStore('PaperItems').getRootNode();
        root.removeAll();

        var layers = this.sharedPaperUser.getSharedProject().layers;
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var layerNode = Ext.create("DD.model.PaperItem", {item:layer, children:[] } )
            root.appendChild(layerNode);
        }
    },
    
    appendLayer: function() {
        this.application.socket.emit("user::drawing::layer::add");
    },
    
    layerItemClick: function(view,rec,item,index,eventObj) {
        if( rec.get('type') == 'layer' )
            this.application.socket.emit("user::drawing::layer::activate", index );
    },
    
});

