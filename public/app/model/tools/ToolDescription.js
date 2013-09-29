if( typeof exports !== 'undefined' )
{
    // This code is shared between server and browser.
    // The browser does not know anything about exports or require.
    var Ext = require('extnode');
}

/*
 * Related class: DD.model.tools.PaperTool
 */
Ext.define('DD.model.tools.ToolDescription',{

    config: {
        uuid        : 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        version     : '0.0.0',
        deprecated  : true,
        icon        : null,
        name        : 'Unknown',
        description : "no description",
        
        // The following events can be generated.
        // During the events you can execute the following functions:
        // this.getColor(); // This returns the user's primary color in paperjs format.
        // this.getSharedProject(); // Get the paperjs project.
        // All variables between events should be stored in this.state.
        toolInit    : function() {}, // toolInit is executed once at the start of every session.
        onMouseDown : function() {},
        onMouseUp   : function() {},
        onMouseDrag : function() {},
        onMouseMove : function() {},
        onKeyDown   : function() {},
        onKeyUp     : function() {},
    },
    
    constructor: function(config) {
        this.initConfig(config);
    },
});

if( typeof exports !== 'undefined' )
{
    module.exports = DD.model.tools.ToolDescription;
}
