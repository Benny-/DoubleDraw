
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
    
    constructor: function (paperScope, toolDescriptions) {
        this.callParent( arguments );
        
        this.users = {}; // Map. keys are user_id's and the values are user objects.
        this.toolDescriptions = {};
        this.paperScope = paperScope;
        this.toolDescriptions = toolDescriptions.clone();
    },
    
    colorChange: function(user_id, color)
    {
        var user = this.users[user_id];
        user.setColor(color);
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
        this.paperScope.activate(); // Note: Activating this paperScope is actually only required on NodeJS, as only the server side program uses multiple paper-scopes.
        var importedToolEvent = this.importToolEvent(toolEvent);
        tool.fire(toolEvent.type, importedToolEvent );
        return importedToolEvent;
    },
    
    addToolDescription: function(toolDescription)
    {
        this.toolDescriptions.push(toolDescription);
        
        var user_ids = Object.keys(this.users);
        for (var i = 0; i < user_ids.length; i++) {
            var user = this.users[user_ids[i]];
            user.addToolDescription(toolDescription, this.paperScope);
        }
    },
    
    addUser: function(user)
    {
        user = new DD.UserDrawContext(user, this.toolDescriptions, this);
        this.users[user.user_id] = user;
    },
    
    removeUser: function(user_id)
    {
        return delete this.users[user_id];
    },
    
    getSharedProject: function()
    {
        return this.paperScope.project;
    },
    
    getUser: function(user_id)
    {
        return this.users[user_id];
    },
    
    getUsers: function()
    {
        return this.users;
    },
    
    getToolDescriptions: function()
    {
        return this.toolDescriptions;
    },
    
    getPaperScope: function()
    {
        return this.paperScope;
    },
    
    exportToolEvent: function(event)
    {
        var exported_event = {
            type: event.type,
            point    : event.point          ?   { x: event.point.x, y: event.point.y}         : null,
            lastPoint: event.lastPoint      ?   { x: event.lastPoint.x, y: event.lastPoint.y} : null,
            downPoint: event.downPoint      ?   { x: event.downPoint.x, y: event.downPoint.y} : null,
            middlePoint: event.middlePoint  ?   { x: event.middlePoint.x, y: event.middlePoint.y} : null,
            delta: event.delta              ?   { x: event.delta.x, y: event.delta.y} : null,
            count: event.count,
            // item: {
            //     id : event.item.id,
            // }
        }
        
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
    
    import: function(sharedPaper) {
        this.paperScope.project.importJSON(sharedPaper.paperProject);
        this.paperScope.project.layers[0].remove();
        this.paperScope.view.draw();
        for (var i = 0; i < sharedPaper.users.length; i++) {
            this.addUser(sharedPaper.users[i]);
        }
    },
    
    export: function() {
        var exported_sharedPaper = {
            paperProject: this.paperScope.project.exportJSON(),
            users: [],
        };
        
        var user_ids = Object.keys(this.users);
        for (var i = 0; i < user_ids.length; i++) {
            var user = this.users[user_ids[i]];
            exported_sharedPaper.users.push(user.export());
        }
        
        return exported_sharedPaper;
    },
    
});

if( typeof exports !== 'undefined' )
{
    module.exports = DD.SharedPaper;
}
