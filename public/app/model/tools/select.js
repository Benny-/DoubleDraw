
if( typeof exports !== 'undefined' )
{
    // This code is shared between server and browser.
    // The browser does not know anything about exports or require.
    var paper = require('paper');
}

var SelectDescription = new DD.model.tools.ToolDescription({
    uuid : 'e129e74b-957e-4ee4-8ae3-c83d84c04274',
    version : '0.0.0',
    deprecated : false,
    icon : null,
    name : 'Select',
    description : "Could be used for transformations",
    
    
    onMouseDown : function(event) {
        console.log( "onMouseDown()", "TODO: Implement function." );
        console.log( this.getSharedProject() );
    },
});

ToolDescriptions.push( SelectDescription );

