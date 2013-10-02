
if( typeof exports !== 'undefined' )
{
    // This code is shared between server and browser.
    // The browser does not know anything about exports or require.
    var paper = require('paper');
}

/**
 * This class does NOT represent a single user but rather a SharedPaper on
 * the user's (client) computer.
 *
 * This class is only run on the client side. While SharedPaper (the parent class)
 * is shared on both sides.
 * 
 * This class has two responsebilities. Transmit ToolEvents and draw other user's cursors.
 * 
 * SharedPaperUser has a proxy tool which generates ToolEvents from user input.
 * The inputs are send to the central server. The server distribute all events
 * to all users.
 * SharedPaper (on all user's and the server) draws on the paper using those inputs.
 * 
 **/
Ext.define('DD.SharedPaperUser',{
    extend: 'DD.SharedPaper',
    
    constructor: function (paperScope, toolDescriptions, toolEventCallback) {
        var me = this;
        this.callParent( arguments );
        
        this.proxyTool = null;
        this.user = null;
        
        this.proxyTool = new paperScope.Tool();
        
        this.proxyTool.onMouseDown = function(event) {
            toolEventCallback( me.exportToolEvent(event) );
        }
        
        this.proxyTool.onMouseUp = function(event) {
            toolEventCallback( me.exportToolEvent(event) );
        }
    
        this.proxyTool.onMouseDrag = function(event) {
            toolEventCallback( me.exportToolEvent(event) );
        }
        
        this.proxyTool.onMouseMove = function(event) {
            toolEventCallback( me.exportToolEvent(event) );
        }
        
        this.proxyTool.onKeyDown = function(event) {
            toolEventCallback( me.exportToolEvent(event) );
        }
        
        this.proxyTool.onKeyUp = function(event) {
            toolEventCallback( me.exportToolEvent(event) );
        }
    },
    
    addToolDescription: function(ToolDescription)
    {
        this.callParent( arguments );
    },
    
    addUser: function(user)
    {
        this.callParent( arguments );
        
        var orginalLayer = this.getSharedProject().activeLayer; // This line might not be needed in the future.
        // It might not be needed if events always activate the correct layer.
        var guiLayer = this.getSharedProject().layers[0];
        
        guiLayer.activate();
        var cursor = new this.paperScope.Path.Circle(new paper.Point(80, 50), 3);
        cursor.name = 'u' + user.user_id;
        cursor.strokeColor = 'black';
        cursor.visible = false;
        orginalLayer.activate();
    },
    
    removeUser: function(user_id)
    {
        this.callParent( arguments );
        var guiLayer = this.getSharedProject().layers[0];
        guiLayer.children['u'+user_id].remove();
    },
    
    updateCursor: function(user_id, importedToolEvent)
    {
        var guiLayer = this.getSharedProject().layers[0];
        var cursor = guiLayer.children['u'+user_id];
        cursor.position = importedToolEvent.point;
        cursor.visible = true;
    },
    
    userToolEvent: function(user_id, toolEvent)
    {
        var importedToolEvent = this.callParent( arguments );
        if(importedToolEvent.point && this.user.user_id != user_id)
        {
            this.updateCursor(user_id, importedToolEvent);
        }
    },
    
    offscreen: function(user_id)
    {
        var guiLayer = this.getSharedProject().layers[0];
        var cursor = guiLayer.children['u'+user_id];
        cursor.visible = false;
    },
    
    /**
     * SetUser should be called once the user was added using addUser(user).
     */
    setUser: function(user)
    {
        this.user = this.getUser(user.user_id);
        var guiLayer = this.getSharedProject().layers[0];
        guiLayer.children['u'+user.user_id].visible = false;
        return this.user;
    },
    
});

