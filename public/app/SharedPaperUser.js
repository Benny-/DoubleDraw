
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
        
        this.uiProject = new this.paperScope.Project(this.paperScope.view);
        
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
    
    getUiProject: function()
    {
        return this.uiProject;
    },
    
    addToolDescription: function(ToolDescription)
    {
        this.callParent( arguments );
    },
    
    addUser: function(user)
    {
        this.callParent( arguments );
        
        this.getUiProject().activate();
        var cursor = new this.paperScope.Path.Circle(new paper.Point(80, 50), 3);
        cursor.name = 'u' + user.user_id;
        cursor.strokeColor = 'black';
        cursor.fillColor = new paper.Color(1, 1, 0.5, 0.6);
        cursor.visible = false;
    },
    
    removeUser: function(user_id)
    {
        this.callParent( arguments );
        var cursorLayer = this.getUiProject().layers[0];
        cursorLayer.children['u'+user_id].remove();
    },
    
    updateCursor: function(user_id, importedToolEvent)
    {
        var cursorLayer = this.getUiProject().layers[0];
        var cursor = cursorLayer.children['u'+user_id];
        cursor.position = importedToolEvent.point;
        cursor.visible = true;
    },
    
    userToolEvent: function(user_id, toolEvent)
    {
        var importedToolEvent = this.callParent( arguments );
        if(importedToolEvent.point && this.user.user_id != user_id && importedToolEvent.point)
        {
            this.updateCursor(user_id, importedToolEvent);
        }
    },
    
    offscreen: function(user_id)
    {
        var cursorLayer = this.getUiProject().layers[0];
        var cursor = cursorLayer.children['u'+user_id];
        cursor.visible = false;
    },
    
    import: function(sharedPaper) {
        this.getUiProject().layers[0].removeChildren();
        
        this.callParent( arguments );
    },
    
    /**
     * SetUser should be called once the user was added using addUser(user).
     */
    setUser: function(user)
    {
        this.user = this.getUser(user.user_id);
        var cursorLayer = this.getUiProject().layers[0];
        cursorLayer.children['u'+user.user_id].visible = false;
        return this.user;
    },
    
});

