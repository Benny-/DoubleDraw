
if( typeof exports !== 'undefined' )
{
    // This code is shared between server and browser.
    // The browser does not know anything about exports or require.
    var Ext = require('extnode');
    var paper = require('paper');
}

Ext.define('DD.UserDrawContext',{
    //extend: 'Ext.util.Observable',
    
    config: {
        user_id: 0,
        tool: {
            uuid: '382954a0-61c9-4009-9a95-637b21c00eff',
        },
        tools: {},
        selection: [],
        color: { r:5, g:5, b:5, a:1.0},
    },
    
    constructor: function (config) {
        this.callParent( arguments );
        
        // this.addEvents({
        //     "color" : true,
        //     "selection" : true,
        // });
        
        this.initConfig( config );
    },
    
    setColor: function(color) {
        this.color = color;
        //this.fireEvent('color', color);
    },
    
    getPaperColor: function()
    {
        return new paper.Color(this.color.r/255, this.color.g/255, this.color.b/255, this.color.a);
    },
    
    setSelection: function(selection) {
        this.selection = selection;
        //this.fireEvent('selection', selection);
    },
    
});

if( typeof exports !== 'undefined' )
{
    module.exports = DD.UserDrawContext;
}
