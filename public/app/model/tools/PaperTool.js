
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
        var exportedState = this.exportState();
        this.state = {};
        this.state = this.importState(exportedState);
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
        Object.keys(exportedState).forEach( function(key)
        {
            var value = exportedState[key];
            state[key] = this.userDrawContext.getSharedPaper().importPaperThing(value);
        }, this);
        
        return state;
    },
    
    exportState: function() {
        var exported_state = {};
        Object.keys(this.state).forEach( function(key)
        {
            var value = this.state[key];
            exported_state[key] = this.userDrawContext.getSharedPaper().exportPaperThing(value);
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
