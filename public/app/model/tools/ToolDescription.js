if( typeof exports !== 'undefined' )
{
    // This code is shared between server and browser.
    // The browser does not know anything about exports or require.
    var Ext = require('extnode');
}

Ext.define('DD.model.tools.ToolDescription',{
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
    constructor: function(config) {
        this.initConfig(config);
    },
});

if( typeof exports !== 'undefined' )
{
    module.exports = DD.model.tools.ToolDescription;
}
