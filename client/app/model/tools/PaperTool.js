
if( typeof exports !== 'undefined' )
{
    // This code is shared between server and browser.
    // The browser does not know anything about exports or require.
    var Ext = require('extnode');
}

/**
 * The PaperTool is kinda like the tool class in PaperJS. Except they are not.
 * 
 * There exist no PaperJS tools for NodeJS. It would make no sense as a server
 * can't provide mouse or keyboard input.
 * 
 * But we still need something to process the events from all the clients and
 * reconstruct vector image. Thats is this class's responsebility.
 **/
Ext.define('DD.model.tools.PaperTool',{
    paper: null,
    toolDescription: null,
    state: {},
    
    config: {
        uuid        : 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        version     : '0.0.0',
        deprecated  : true,
        icon        : null,
        name        : 'Unknown',
        description : "no description",
        
        toolInit    : function() {},
        onMouseDown : function() {},
        onMouseUp   : function() {},
        onMouseDrag : function() {},
        onMouseMove : function() {},
        onKeyDown   : function() {},
        onKeyUp     : function() {},
    },
    
    constructor: function (paperScope, toolDescription, userDrawContext) {
        this.callParent( arguments );
        this.paper = paperScope;
        this.toolDescription = toolDescription;
        this.initConfig(toolDescription.initialConfig);
        this.user = userDrawContext;
        this.toolInit();
    },
    
    fire: function(type, event){
        if(type == 'mousedown')
            this.onMouseDown(event)
        if(type == 'mouseup')
            this.onMouseUp(event)
        if(type == 'mousedrag')
            this.onMouseDrag(event)
        if(type == 'mousemove')
            this.onMouseMove(event)
        if(type == 'keydown')
            this.onKeyDown(event)
        if(type == 'keyup')
            this.onKeyUp(event)
    },
});

if( typeof exports !== 'undefined' )
{
    module.exports = DD.model.tools.PaperTool;
}