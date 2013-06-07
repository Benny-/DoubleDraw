
/*
SharedDrawingContext class

Paperjs does not support multiple peaple drawing on a shared paper.
It is this class's responsebility to ensure it can.

toolCreators - Should be a array of tool creators. See tool_creators.js
users - Should be a array of user objects.

Every user dict should have the following fields:
 - user_id
 - tools (A array containing tool dicts containing uuid, version and state)
*/
SharedDrawingContext = function(ToolClassesParam, usersArrayParam)
{
    var users = {}; // A map: user_id -> user
    var ToolClasses = [];
    
    if(ToolClassesParam !== undefined)
    {
        for (var i = 0; i < ToolClassesParam.length; i++) {
            this.addToolClass(ToolClassesParam[i]);
        }
    }
    
    if(usersArrayParam !== undefined)
    {
        for (var i = 0; i < usersArrayParam.length; i++) {
            this.addUser(usersArrayParam[i]);
        }
    }
    
    this.addJSONEvent = function(json_event)
    {
        var user = users[json_event.user_id];
        var tool = user.tools['382954a0-61c9-4009-9a95-637b21c00eff'];
        console.log(json_event)
        tool.fire(json_event.type, json_event);
    }
    
    this.addToolClass = function(Tool)
    {
        ToolClasses.push(Tool);
        var user_ids = Object.keys(users);
        for (var i = 0; i < user_ids.length; i++) {
            var user = users[user_ids[i]];
            var tool = new Tool();
            user[tool.uuid] = tool;
        }
    }
    
    this.addUser = function(user)
    {
        users[user.user_id] = user;
        user.tools = {}; // FIXME: I am throwing all tool.state's away.
        for (var i = 0; i < ToolClasses.length; i++) {
            var tool = new ToolClasses[i]();
            user.tools[tool.uuid] = tool;
        }
    }
    
    this.removeUser = function(user)
    {
        
    }
    
    this.removeAllUsers = function()
    {
        var user_ids = Object.keys(users);
        for (var i = 0; i < user_ids.length; i++) {
            var user = users[user_ids[i]];
            this.removeUser(user);
        }
    }
    
    this.getToolClasses = function()
    {
        return ToolClasses;
    }
}
