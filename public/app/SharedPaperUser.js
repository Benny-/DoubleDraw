
/**
 * This class is only run on the client side. While SharedPaper (the parent class)
 * is shared on both sides.
 * 
 * SharedPaperUser has a proxy tool which generates ToolEvents from user input.
 * The inputs are send to the central server. The server distribute all events
 * to all users.
 * SharedPaper (on all user's and the server) draws on the paper using those inputs.
 * 
 **/
Ext.define('DD.SharedPaperUser',{
    extend: 'DD.SharedPaper',
    
    onToolEventCallback : null,
    user_id             : NaN,
    proxy_tool          : null,
    
    constructor: function (paperScope, toolDescriptions, toolEventCallback) {
        this.callParent( arguments );
        
        var SharedPaperUser = this;
        this.proxyTool = new paperScope.Tool();
        
        this.proxyTool.onMouseDown = function(event) {
            toolEventCallback( SharedPaperUser.exportToolEvent(event) );
        }
        
        this.proxyTool.onMouseUp = function(event) {
            toolEventCallback( SharedPaperUser.exportToolEvent(event) );
        }
    
        this.proxyTool.onMouseDrag = function(event) {
            toolEventCallback( SharedPaperUser.exportToolEvent(event) );
        }
        
        this.proxyTool.onMouseMove = function(event) {
            toolEventCallback( SharedPaperUser.exportToolEvent(event) );
        }
        
        this.proxyTool.onKeyDown = function(event) {
            toolEventCallback( SharedPaperUser.exportToolEvent(event) );
        }
        
        this.proxyTool.onKeyUp = function(event) {
            toolEventCallback( SharedPaperUser.exportToolEvent(event) );
        }
    },
    
    userToolEvent: function(event)
    {
        this.callParent( arguments );
        this.paperScope.view.draw();
    },
    
    addToolDescription: function(ToolDescription)
    {
        this.callParent( arguments );
    },
    
    setUser: function(user)
    {
        this.addUser(user);
    },
    
});
