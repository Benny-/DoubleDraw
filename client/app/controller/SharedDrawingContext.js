
/*
SharedDrawingContext class

Paperjs does not support multiple peaple drawing on a shared paper.
It is this class responsebility to ensure it can.

toolCreators - Should be a array of tool creators. See tool_creators.js
users - Should be a array of user objects.

Every user dict should have the following fields:
 - user_id
 - tools (A array containing tool dicts containing uuid, version and state)
*/
SharedDrawingContext = function(paperScope, ToolClasses, usersArray)
{
    var user = {}; // A map: user_id -> user
    var activeToolCreators = [];
    
    usersArray.forEach( function(user)
        {
            userMap[user.user_id] = user;
            user.tools = {}; // A map: uuid -> tool
        }
    );
    
    for (var i = 0; i < usersArray.length; i++) {
        var user = usersArray[i];
    }
    
    for (var i = 0; i < Creators.length; i++) {
        var creator = Creators[i];
    }
    
    Creators.forEach( function(Tool)
    {
        var tool = new Tool();
        user.tools.push(tool);
    });
    
    this.addJSONEvent = function(json_event)
    {
        
    }
    
    this.addTool = function(Tool)
    {
        
    }
    
    this.addUser = function(user)
    {
        
    }
    
    this.removeUser = function(user)
    {
        
    }
    
    this.getTools = function()
    {
        
    }
}
