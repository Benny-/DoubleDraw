
if( typeof exports !== 'undefined' )
{
    // This code is shared between server and browser.
    // The browser does not know anything about exports or require.
    var Ext = require('extnode');
    var PaperTool = require('./model/tools/PaperTool.js');
    var UserDrawContext = require('./UserDrawContext.js');
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
    
    colorChange: function(user_id, color)
    {
        var user = this.users[user_id];
        user.setColor(color);
    },
    
    selectionChange: function(user_id, selection)
    {
        var user = this.users[user_id];
        user.setSelection(selection);
    },
    
    userToolChange: function(user_id, tool)
    {
        var user = this.users[user_id];
        user.tool = user.tools[tool.uuid];
    },
    
    userToolEvent: function(user_id, toolEvent)
    {
        var user = this.users[user_id];
        var tool = user.tool;
        if(this.paperScope.activate)
        {
            // XXX: activate() is required to change global paper scope on the server.
            // It is not possible to do this on node using "paper = this.paperScope" as
            // paper is private to the paper module.
            // 
            // activate() is not yet part of the official paperjs repo.
            // The function looks like this in PaperScope.js:
            // activate: function() { paper = this; },
            //
            // Remove these comments once it is part of the official repo.
            this.paperScope.activate();
        }
        tool.fire(toolEvent.type, this.importToolEvent(toolEvent) );
    },
    
    addToolDescription: function(ToolDescription)
    {
        this.ToolDescriptions.push(ToolDescription);
        var user_ids = Object.keys(this.users);
        for (var i = 0; i < user_ids.length; i++) {
            var user = this.users[user_ids[i]];
            var tool = new DD.model.tools.PaperTool(this.paperScope, ToolDescription, user);
            user.tools[tool.uuid] = tool;
        }
    },
    
    addUser: function(user)
    {
        user = new DD.UserDrawContext(user);
        this.users[user.user_id] = user;
        user.tools = {}; // FIXME: I am throwing all tool.state's away.
        for (var i = 0; i < this.ToolDescriptions.length; i++) {
            var tool = new DD.model.tools.PaperTool(this.paperScope, this.ToolDescriptions[i], user);
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
    
    getPaperScope: function()
    {
        return this.paperScope;
    },
    
    exportToolEvent: function(event)
    {
        var exported_event = {
            type: event.type,
            point: { x: event.point.x, y: event.point.y},
            lastPoint: (event.lastPoint ? { x: event.lastPoint.x, y: event.lastPoint.y} : null),
            downPoint: event.downPoint ? { x: event.downPoint.x, y: event.downPoint.y} : null,
            // middlePoint: event.middlePoint ? { x: event.middlePoint.x, y: event.middlePoint.y} : null, // XXX: This line will kill the server
            delta: event.delta ? { x: event.delta.x, y: event.delta.y} : null,
            count: event.count,
            // item: {
            //     id : event.item.id,
            // }
        }
        
        // event.middlePoint should only be included if the event is a drag or mouseup.
        // We can't simply check if event.middlePoint exist, as it causes a stack overflow (idk why).
        if(event.type == 'mousedrag' || event.type == 'mouseup')
            exported_event.middlePoint = { x: event.middlePoint.x, y: event.middlePoint.y};
        
        return exported_event;
    },
    
    importToolEvent: function(event)
    {
        return {
            type: event.type,
            point: new this.paperScope.Point(event.point),
            lastPoint: event.lastPoint ? new this.paperScope.Point(event.lastPoint) : null,
            downPoint: event.downPoint ? new this.paperScope.Point(event.downPoint) : null,
            middlePoint: event.middlePoint ? new this.paperScope.Point(event.middlePoint) : null,
            delta: new this.paperScope.Point(event.delta),
            count: event.count,
            // item: {
            //     id : event.item.id,
            // }
        }
    },
});

if( typeof exports !== 'undefined' )
{
    module.exports = DD.SharedPaper;
}
