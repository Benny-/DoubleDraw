
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
    		// XXX: Clone is required on the following line.
    		// A paperjs item's position might not be a actual Point object.
    		// This is a bug. A bug which seems to be fixed if you use paperjs 0.9.9 or later.
    		// But for some reason it is not fixed on nodejs's paper version.
    		// By explicitly cloning the fake Point object it becomes a real Point object, thereby sidestepping the whole issue.
    		// The following was used to trigger the bug:
    		// - user 1 enters room.
    		// - user 1 draws something and moves the item using the select tool.
    		// - user 2 enters room (The server crashes at this point as it tries to expect the fake point object).
    		this.state.orginalPosition = hitresults.item.position.clone();
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

