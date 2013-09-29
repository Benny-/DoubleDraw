
if( typeof exports !== 'undefined' )
{
    // This code is shared between server and browser.
    // The browser does not know anything about exports or require.
    var Ext = require('extnode');
    var paper = require('paper');
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
    
    constructor: function (UserDrawContext, toolDescription, state) {
        this.callParent( arguments );
        this.toolDescription = toolDescription;
        this.initConfig(toolDescription.initialConfig);
        this.userDrawContext = UserDrawContext;
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
        
        /*
         * Code for importing and exporting items is only used when a new user joins a room.
         * Uncommenting the following lines will execute the import/export code on every tool event,
         * making it easier to debug in the browser.
         */
        // var exportedState = this.exportState();
        // this.state = {};
        // this.state = this.importState(exportedState);
        // console.log("exportedState", exportedState, "importedState", this.state, event);
    },
    
    getColor: function() {
        return this.userDrawContext.getPaperColor();
    },
    
    getSharedProject: function() {
        return this.userDrawContext.getSharedPaper().getSharedProject();
    },
    
    importState: function(exportedState) {
        var state = {};
        var project = this.getSharedProject();
        
        var importItem = function(exportedItem)
        {
            // See the exportItem() function down below.
            return project.layers[0].children[exportedItem[1]];
        }
        
        var importSegment = function(exportedSegment)
        {
        	console.log(exportedSegment);
        	var path = importItem(exportedSegment[2]);
        	var segment = path.segments[exportedSegment[1]];
        	return segment;
        }
        
        Object.keys(exportedState).forEach( function(key)
        {
            var value = exportedState[key];
            if( value == null || typeof value == 'undefined' || typeof value == 'number' || typeof value == 'string' || typeof value == 'boolean')
                state[key] = value; // Primitive types can directly be exported
            else if(value[0] === 'item')
                state[key] = importItem.call(this, value);
            else if(value[0] === 'segment')
                state[key] = importSegment.call(this, value);
            else
                // What is going on here?
                // Well..
                // Basic types are serialized like this: ["Point",3,6]
                // Basic types can be created like this: new paper.Point(3, 6)
                // We are directly converting a serialized form of a basic type to a real basic object
                // by picking a different constructor during runtime.
                state[key] = new paper[value[0]](value[1], value[2], value[3], value[4], value[5], value[6], value[7], value[8], value[9], value[10], value[11], value[12]);
        }, this);
        
        return state;
    },
    
    // Export complex objects to primitives so they can be send over the internets.
    // Function is only used server-side.
    exportState: function() {
        var exported_state = {};
        var project = this.getSharedProject();
        
        var exportItem = function(item) {
            // Function for exporting a paperjs item.
            
            var exportedItem;
            
            // This implementation has several flaws:
            // - it assumes a single layer
            // - it assumes the item is a direct child of the layer
            // - it assumes the item exist
            for(var i = 0; i<project.layers[0].children.length; i++)
            {
                var possibleMatch = project.layers[0].children[i];
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
            return ['segment', segment.index, exportItem.call(this, segment.path) ];
        };
        
        var isPaperJsItem = function(possibleItem) {
            var proto = Object.getPrototypeOf(possibleItem);
            if (proto)
            {
                if (proto.constructor == paper.Item) {
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
            else if(Object.getPrototypeOf(value).constructor == paper.Segment)
                exported_state[key] = exportSegment.call(this, value);
            else if(isPaperJsItem.call(this, value))
                exported_state[key] = exportItem.call(this, value);
            else if(Object.getPrototypeOf(value).constructor == paper.Point)
                exported_state[key] = value.toJSON();
            else if(Object.getPrototypeOf(value).constructor == paper.Size)
                exported_state[key] = value.toJSON();
            else if(Object.getPrototypeOf(value).constructor == paper.Rectangle)
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
