
if( typeof exports !== 'undefined' )
{
    // This code is shared between server and browser.
    // The browser does not know anything about exports or require.
    var Ext = require('extnode');
}

/**
 * The PaperTool is kinda like the tool class in PaperJS. Except it is not.
 * 
 * There exist no PaperJS tools for NodeJS. It would make no sense as a server
 * can't provide mouse or keyboard input.
 * 
 * But we still need something to process the events from all the clients and
 * reconstruct vector image. Thats is this class's responsibility.
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
    
    constructor: function (paperScope, toolDescription, userDrawContext, state) {
        this.callParent( arguments );
        this.paper = paperScope;
        this.toolDescription = toolDescription;
        this.initConfig(toolDescription.initialConfig);
        this.user = userDrawContext;
        this.state = {};
        this.toolInit();
        if(state)
            this.state = this.importState(state);
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
    
    importState: function(exportedState) {
        var state = {};
        
        var importItem = function(exportedItem)
        {
            // See the exportItem() function down below.
            return this.paper.project.layers[0].children[exportedItem[1]];
        }
        
        Object.keys(exportedState).forEach( function(key)
        {
            var value = exportedState[key];
            if( value == null || typeof value == 'undefined' || typeof value == 'number' || typeof value == 'string' || typeof value == 'boolean')
                state[key] = value; // Primitive types can directly be exported
            else if(value[0] === 'item')
                state[key] = importItem.call(this, value);
            else if(value[0] === 'segment')
                state[key] = null; // TODO: import segment from serialized form.
            else
                // What is going on here?
                // Well..
                // Basic types can be created like this: new paper.Point(3, 6)
                // Basic types are serialized like this: ["Point",3,6]
                // We are directly converting a serialized form of a basic type to a real basic object using a constructor.
                state[key] = new this.paper[value[0]](value[1], value[2], value[3], value[4], value[5], value[6], value[7], value[8], value[9], value[10], value[11], value[12]);
        }, this);
        
        return state;
    },
    
    // Export complex objects to primitives so they can be send over the internets.
    // Function is only used server-side.
    exportState: function() {
        var exported_state = {};
        
        var exportItem = function(item) {
            // Function for exporting a paperjs item.
            
            var exportedItem;
            
            // This implementation has several flaws:
            // - it assumes a single layer
            // - it assumes the item is a direct child of the layer
            // - it assumes the item exist
            for(var i = 0; i<this.paper.project.layers[0].children.length; i++)
            {
                var possibleMatch = this.paper.project.layers[0].children[i];
                if(possibleMatch == item)
                {
                    exportedItem = ['item', i];
                }
            }
            
            if(!exportedItem)
                console.warn("Item not found: ", item);
            
            return exportedItem;
        }
        
        var exportSegment = function(segment) {
            // TODO: Implement function.
            return 'EXPORTED_SEGMENT_HERE'
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
                    return isPaperJsItem.call(this, proto);
                }
            }
            return false;
        };
        
        Object.keys(this.state).forEach( function(key)
        {
            var value = this.state[key];
            if( value == null || typeof value == 'undefined' || typeof value == 'number' || typeof value == 'string' || typeof value == 'boolean')
                exported_state[key] = value; // Primitive types can directly be exported
            else if(Object.getPrototypeOf(value).constructor == this.paper.Segment)
                exported_state[key] = exportSegment.call(this, value);
            else if(isPaperJsItem.call(this, value))
                exported_state[key] = exportItem.call(this, value);
            else if(Object.getPrototypeOf(value).constructor == this.paper.Point)
                exported_state[key] = value.toJSON();
            else if(Object.getPrototypeOf(value).constructor == this.paper.Size)
                exported_state[key] = value.toJSON();
            else if(Object.getPrototypeOf(value).constructor == this.paper.Rectangle)
                exported_state[key] = value.toJSON();
            else
                throw new Error("Can't export value: " + value);
        }, this);
        
        return exported_state;
    },
    
    export: function() {
        return {
            uuid: this.uuid,
            version: this.version,
            state: this.exportState(),
        };
    },
    
});

if( typeof exports !== 'undefined' )
{
    module.exports = DD.model.tools.PaperTool;
}