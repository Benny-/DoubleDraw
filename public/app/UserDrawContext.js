
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
        nickname: 'Unknown',
        tool: {
            uuid: '382954a0-61c9-4009-9a95-637b21c00eff',
        },
        color: {    // Value ranges
            r:5,    // 0    -   255
            g:5,    // 0    -   255
            b:5,    // 0    -   255
            a:1.0   // 0.0  -   1.0
        },
    },
    
    constructor: function (config, toolDescriptions, SharedPaper) {
        this.callParent( arguments );
        this.sharedPaper = SharedPaper;
        this.initConfig( config );
        this.tools = {};
        
        if(config.tools)
        {
            // This execution path is only taken on the client
            this.import(config.tools, toolDescriptions);
        }
        else
        {
            // This execution path is only taken on the server if a new player joins the fray.
            toolDescriptions.forEach( function(toolDescription) {
                this.addToolDescription(toolDescription);
            }, this);
        }
        
        this.tool = this.tools[this.tool.uuid];
        
        // this.addEvents({
        //     "color" : true,
        //     "selection" : true,
        // });
    },
    
    setColor: function(color) {
        this.color = color;
        //this.fireEvent('color', color);
    },
    
    getPaperColor: function()
    {
        return new paper.Color(this.color.r/255, this.color.g/255, this.color.b/255, this.color.a);
    },
    
    getSharedPaper: function()
    {
    	return this.sharedPaper;
    },
    
    addToolDescription: function(toolDescription) {
        var tool = new DD.model.tools.PaperTool(this, toolDescription);
        this.tools[tool.uuid] = tool;
    },
    
    import: function(tools, toolDescriptions) {
        tools.forEach( function(tool) {
            this.tools[tool.uuid] = new DD.model.tools.PaperTool(this, toolDescriptions.get(tool.uuid, tool.version), tool.state);
        }, this);
    },
    
    export: function() {
        var exported_user = {
            user_id     : this.user_id,
            nickname    : this.nickname,
            tool        : { uuid: this.tool.uuid },
            tools       : [],
            color       : this.color,
        };
        
        var tool_uuids = Object.keys(this.tools);
        for (var i = 0; i < tool_uuids.length; i++) {
            var tool = this.tools[tool_uuids[i]];
            exported_user.tools.push(tool.export());
        }
        
        return exported_user;
    },
    
});

if( typeof exports !== 'undefined' )
{
    module.exports = DD.UserDrawContext;
}
