
var next_user_id = 1;

/*
The User class.

The main function of the user class are the export functions.
The export functions ensure no private data which should only be
kept on the server is leaking to the clients.

Some private data include paperjs structures, those can't be sent
over socket.io.
*/
module.exports = function(socket)
{
    this.user_id = next_user_id++;
    this.tool = {};
    this.nickname = "Anonymous"
    this.tool = {}
    this.tool.uuid = '382954a0-61c9-4009-9a95-637b21c00eff';
    this.tools = {};
    
    this.exportUser_ID = function()
    {
        return {user_id: this.user_id};
    }
    
    this.exportJSON = function()
    {
        var json = this.exportUser_ID();
        json.nickname = this.nickname;
        json.tool = { uuid : this.tool.uuid };
        return json;
    }
    
}
