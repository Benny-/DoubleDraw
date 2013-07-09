
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
        this.state = {};
        this.toolInit();
    },
    
    fire: function(type, event) {
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
    
    getColor: function() {
        return this.user.getPaperColor();
    },
    
    // Export complex objects to primitives so they can be send over the internets.
    // Function is only used server-side.
    exportState: function() {
        var exported_state = {};
        
        var exportItem = function(item) {
            // Function for exporting a paperjs item.
            
            // TODO: Implement function.
        }
        
        var exportSegment = function(segment) {
            // TODO: Implement function.
        };
        
        var isPaperJsItem = function(possibleItem) {
            var proto = Object.getPrototypeOf(possibleItem);
            if (proto)
            {
                if (proto.constructor == this.paper.Item) {
                    return true;
                }
                else
                {
                    return isPaperJsItem(proto);
                }
            }
            return false;
        };
        
        Object.keys(this.state).forEach( function(key)
        {
            if(Object.getPrototypeOf(this.state[key]).constructor == this.paper.Segment)
                exported_state[key] = exportSegment(this.state[key]);
            else if(isPaperJsItem(this.state[key]))
                exported_state[key] = exportItem(this.state[key]);
            else
                exported_state[key] = this.state[key];
        }, this);
        
        return exported_state;
    },
    
    // Function is only used client-side.
    importState: function() {
        // TODO: Implement function.
    },
    
});

if( typeof exports !== 'undefined' )
{
    module.exports = DD.model.tools.PaperTool;
}