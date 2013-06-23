
if( typeof exports !== 'undefined' )
{
    // This code is shared between server and browser.
    // The browser does not know anything about exports or require.
    var Ext = require('extnode');
    var PaperTool = require('./model/tools/PaperTool.js');
}

/**
 * Paperjs does not support multiple people drawing on a shared paper.
 * It is this class's responsebility to ensure it can.
 **/
Ext.define('DD.SharedPaper',{
    paperScope : null,
    users: {}, // Map. keys are user_id's and the values are user objects.
    ToolDescriptions: [],
    
    constructor: function (paperScope) {
        this.paperScope = paperScope;
        this.callParent( arguments );
    },
    
    userToolChangeEvent: function(user_id, tool_change)
    {
        var user = this.users[tool_change.user_id];
        user.tool = user.tools[tool_change.tool.uuid];
    },
    
    userToolEvent: function(user_id, tools_event)
    {
        var user = this.users[user_id];
        var tool = user.tool;
        tool.fire(tools_event.type, tools_event);
    },
    
    addToolDescription: function(ToolDescription)
    {
        this.ToolDescriptions.push(ToolDescription);
        var user_ids = Object.keys(this.users);
        for (var i = 0; i < user_ids.length; i++) {
            var user = this.users[user_ids[i]];
            var tool = new DD.model.tools.PaperTool(this.paperScope, ToolDescription);
            user.tools[tool.uuid] = tool;
        }
    },
    
    addUser: function(user)
    {
        this.users[user.user_id] = user;
        user.tools = {}; // FIXME: I am throwing all tool.state's away.
        for (var i = 0; i < this.ToolDescriptions.length; i++) {
            var tool = new DD.model.tools.PaperTool(this.paperScope, this.ToolDescriptions[i]);
            user.tools[tool.uuid] = tool;
        }
        user.tool = user.tools[user.tool.uuid];
    },
    
    removeUser: function(user_id)
    {
        // TODO: Implement function.
    },
    
    destroy: function()
    {
        var user_ids = Object.keys(this.users);
        for (var i = 0; i < user_ids.length; i++) {
            var user = this.users[user_ids[i]];
            this.removeUser(user);
        }
        
        // TODO: Clear paperjs here?
    },
    
    getUsers: function()
    {
        return this.users;
    },
    
    getToolDescriptions: function()
    {
        return this.ToolClasses;
    },
    
    exportToolEvent: function(event)
    {
        return {
            type: event.type,
            point: { x: event.point.x, y: event.point.y},
            lastPoint: (event.lastPoint ? { x: event.lastPoint.x, y: event.lastPoint.y} : null),
            downPoint: event.downPoint ? { x: event.downPoint.x, y: event.downPoint.y} : null,
            //middlePoint: event.middlePoint, // Causes stack overflow.
            delta: event.delta,
            count: event.count,
            // item: {
            //     id : event.item.id,
            // }
        }
    },
    
    importToolEvent: function(event)
    {
        return event;
    },
});

if( typeof exports !== 'undefined' )
{
    module.exports = DD.SharedPaper;
}
