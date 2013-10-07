
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
        toolUse     : function() {},
        toolChange  : function() {},
        onMouseDown : function(event) {},
        onMouseUp   : function(event) {},
        onMouseDrag : function(event) {},
        onMouseMove : function(event) {},
        onKeyDown   : function(event) {},
        onKeyUp     : function(event) {},
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
        else if(type == 'mouseup')
            this.onMouseUp(event)
        else if(type == 'mousedrag')
            this.onMouseDrag(event)
        else if(type == 'mousemove')
            this.onMouseMove(event)
        else if(type == 'keydown')
            this.onKeyDown(event)
        else if(type == 'keyup')
            this.onKeyUp(event)
        else {
            throw new Error("Unknown event");
        }
        
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
        return this.userDrawContext.getSharedProject();
    },
    
    importState: function(exportedState) {
        var state = {};
        var project = this.getSharedProject();
        
        var importItem = function(exportedItem)
        {
            // See the exportItem() function down below.
            return project.layers[exportedItem[1]].children[exportedItem[2]];
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
            
            // This implementation has flaws:
            // - it assumes the item is in the top layer
            // - it assumes the item exist
            for(var l = 0; l<project.layers.length; l++)
            {
                for(var i = 0; i<project.layers[l].children.length; i++)
                {
                    var possibleMatch = project.layers[l].children[i];
                    if(possibleMatch == item)
                    {
                        exportedItem = ['item',l, i];
                    }
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
                if (proto._class == 'Item') {
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
            else if(value._class == 'Segment')
                exported_state[key] = exportSegment.call(this, value);
            else if(isPaperJsItem.call(this, value))
                exported_state[key] = exportItem.call(this, value);
            else if(value._class == 'Point') // Basic paperjs items can be directly converted to json. They have no relation to another paperjs object in the same paperscope (XXX: Not entirely true).
                exported_state[key] = value.toJSON();
            else if(value._class == 'Size')
                exported_state[key] = value.toJSON();
            else if(value._class == 'Rectangle')
                exported_state[key] = value.toJSON();
            else
                throw new Error("Can't export "+key+": " + value);
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
