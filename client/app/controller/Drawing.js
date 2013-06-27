
Ext.define('DD.controller.Drawing', {
    extend: 'Ext.app.Controller',
    
    sharedPaperUser: null,
    colorSelectionPrimary: null,
    colorSelectionSecondary: null,
    
    primaryColor: null,
    secondaryColor: null,
    
    model: [
        'Color',
    ],
    
    views: [
        'Canvas',
        'Tools',
        'ColorBox',
        'ColorPicker',
    ],
    
    init: function() {
        
        this.primaryColor = Ext.create("DD.model.Color",{
            r:5,
            g:5,
            b:5,
            a:0.8
        });
        this.secondaryColor = Ext.create("DD.model.Color",{
            r:255,
            g:255,
            b:255,
            a:0.8
        });
        
        this.primaryColor.on(
            'change',
            function(){
                this.application.socket.emit('user::drawing::color', this.primaryColor.export() );
            },
            this);
        
        this.control({
            'panel#canvasPanel': {
                render: this.onPanelRendered,
                resize: this.onPanelResize,
            },
            'colorbox#colorSelectionPrimary': {
                render: this.onColorSelectionPrimaryRendered,
                click: this.onColorSelectionPrimaryClick,
            },
            'colorbox#colorSelectionSecondary': {
                render: this.onColorSelectionSecondaryRendered,
                click: this.onColorSelectionSecondaryClick,
            },
            'tools': {
                beforerender: this.toolsInit,
            },
        });
    },
    
    onPanelRendered: function(panel) {
        this.application.canvas = document.getElementById('html5_canvas');
        this.application.paper.setup('html5_canvas');
        
        var controller = this;
        this.application.on("room::entered", function(roomState) {
            // TODO: Clear paper of any existing scribbles.
            controller.application.paper.project.importJSON(roomState.paper_project);
            controller.application.paper.view.draw();
            controller.sharedPaperUser = new Ext.create(
                'DD.SharedPaperUser',
                controller.application.paper,
                roomState.user.user_id,
                function(event){
                    controller.application.socket.emit("user::drawing::tool::event", event );
                }
            );
            
            controller.sharedPaperUser.addToolDescription(ToolDescriptions[0]);
            controller.sharedPaperUser.addToolDescription(ToolDescriptions[1]);
            
            for (var i = 0; i < roomState.users.length; i++) {
                controller.sharedPaperUser.addUser(roomState.users[i]);
            }
            controller.sharedPaperUser.setUser(roomState.user);
        });
        
        this.application.on("user::drawing::color", function(data) {
            controller.sharedPaperUser.colorChange(data.user_id, data.color);
        });
        
        this.application.on("user::drawing::selection", function(data) {
            controller.sharedPaperUser.selectionChange(data.user_id, data.selection);
        });
        
        this.application.on("room::user::leave", function(user) {
            controller.sharedPaperUser.removeUser(user);
        });
        
        this.application.on("room::user::new", function(user) {
            controller.sharedPaperUser.addUser(user);
        });
        
        this.application.on("user::drawing::tool::change", function(data) {
            controller.sharedPaperUser.userToolChange(data.user_id, data.tool);
        });
        
        this.application.on("user::drawing::tool::event", function(event) {
            controller.sharedPaperUser.userToolEvent(event.user_id, event);
            controller.application.paper.view.draw();
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
    
    onColorSelectionPrimaryClick: function() {
        Ext.create('DD.view.ColorPicker', {
            title: "Change primary drawing color",
            color: this.primaryColor,
        }).show();
    },
    
    onColorSelectionSecondaryClick: function() {
        this.primaryColor.swap(this.secondaryColor);
    },
    
    toolsInit: function( component, eOpts ) {
        
        var controller = this;
        for (var i = 0; i < ToolDescriptions.length; i++) {
            var toolDescription = ToolDescriptions[i];
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
        }
    },
    
});
