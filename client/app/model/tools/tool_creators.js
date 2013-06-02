
/*
This array contains a number of function. Every function in the array can create a different kind of paperjs tool.
The function requires 1 parameter, a paperScope. The function returns a tool associated with the paperScope.

The returned tool will have 5 additional fields in addition to all paperjs fields:

var tool = tool_creator[0](paper)
tool.uuid; // A UUID string.
tool.deprecated; // A boolean value.
tool.icon; // A url pointing to a 48x48 pixel icon.
tool.name; // A friendly name.
tool.description; // A description about what the tool does in a one or two sentences.

*/

var tool_creator = [];
