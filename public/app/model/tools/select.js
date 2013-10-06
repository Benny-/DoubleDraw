
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
    description : "Select and move objects",
    
    onMouseDown : function(event) {
    	hitresults = this.getSharedProject()
    					.hitTest(
    						event.point,
							{
								fill: true,
								stroke: true,
								segments: true,
								tolerance: true,
							});
    	
    	if(hitresults)
    	{
    		hitresults.item.selected = true;
    		this.state.item = hitresults.item;
    		this.state.orginalPosition = hitresults.item.position;
    		this.state.orginalPoint = event.point;
    	}
    },
    
    onMouseDrag : function(event) {
    	if(this.state.item)
    	{
    		this.state.item.position = this.state.orginalPosition.subtract(this.state.orginalPoint.subtract(event.point));
    	}
    },
    
    onMouseUp : function(event) {
    	if(this.state.item)
    	{
    		this.state.item.selected = false;
    		this.state.item = null;
    	}
    },
});

ToolDescriptions.push( SelectDescription );

