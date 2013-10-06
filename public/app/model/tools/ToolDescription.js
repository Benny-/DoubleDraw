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
        
        // The following events can be generated. A tool may implement any or none at all. They are all optional.
        toolInit    : function() {},        // toolInit is executed once at the start of every room join.
                                            // toolInit is a nice point to populate "this.state" with initial values.
        toolUse     : function() {},        // Executed every time the tool is selected.
        toolChange  : function() {},        // Executed every time a other tool is selected.
        onMouseDown : function(event) {},   // http://paperjs.org/reference/tool/#onmousedown
        onMouseUp   : function(event) {},   // http://paperjs.org/reference/tool/#onmouseup
        onMouseDrag : function(event) {},   // http://paperjs.org/reference/tool/#onmousedrag
        onMouseMove : function(event) {},   // http://paperjs.org/reference/tool/#onmousemove // Warning! Server may drop this event.
        onKeyDown   : function(event) {},   // http://paperjs.org/reference/tool/#onkeydown
        onKeyUp     : function(event) {},   // http://paperjs.org/reference/tool/#onkeyup
        // During the events you can execute the following functions:
        //   this.getColor();           // This returns the user's primary color in paperjs format.
        //   this.getSharedProject();   // Get the paperjs project.
        // All variables between events should be stored in this.state.
    },
    
    constructor: function(config) {
        this.initConfig(config);
    },
});

if( typeof exports !== 'undefined' )
{
    module.exports = DD.model.tools.ToolDescription;
}
