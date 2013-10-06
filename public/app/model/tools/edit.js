
if( typeof exports !== 'undefined' )
{
    // This code is shared between server and browser.
    // The browser does not know anything about exports or require.
    var paper = require('paper');
}

var EditDescription = new DD.model.tools.ToolDescription({
    uuid : '9595b70a-ab79-44a2-85c6-91d298fa0be0',
    version : '0.0.0',
    deprecated : false,
    icon : null,
    name : 'edit',
    description : "Edit paths by nodes",
    
    onMouseDown : function(event)
    {
        
    },

    onMouseDrag : function(event) {
		
    },
    
    onMouseUp : function(event) {
		
    },
});

ToolDescriptions.push( EditDescription );

