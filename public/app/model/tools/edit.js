/* 
 * This file contains lines from a GNU GPL project. (CTRL+F 'inkscape')
 * 
 * Authors:
 *   Krzysztof Kosiński <tweenk.pl@gmail.com>
 *   Jon A. Cruz <jon@joncruz.org>
 */
 
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
    
    toolInit: function()
    {
        this.state.path = null;
        this.state.type = null;
        this.state.currentSegment = null;
        this.state.currentCurveLocation = null;
        
		// Finds if the point hit any of the handle's.
		// Returns the segment the point hit and which handle ('point', 'handleIn', 'handleOut') on the segment it hit.
        this.findHandle = function(path, point) {
		    var types = ['point', 'handleIn', 'handleOut'];
			for (var i = 0, l = path.segments.length; i < l; i++) {
			    var segment = path.segments[i];
				for (var j = 0; j < types.length; j++) {
					var type = types[j];
					var segmentPoint = (type == 'point')
							? segment.point
							: segment.point + segment[type];
					var distance = ( point.subtract(segmentPoint) ).length;
					if (distance < 3) {
						return {
							type: type,
							segment: segment
						};
					}
				}
			}
			return null;
		};
		
		
		this.resetSelection = function()
		{
		    if(this.state.path)
                this.state.path.selected = false;
            if(this.state.currentSegment)
                this.state.currentSegment.selected = false;
		    if(this.state.currentCurveLocation)
		    {
		        this.state.currentCurveLocation.curve.handle1.selected = false;
		        this.state.currentCurveLocation.curve.handle2.selected = false;
		    }
            this.state.path = null;
            this.state.type = null;
            this.state.currentSegment = null;
            this.state.currentCurveLocation = null;
		};
    },
    
    onMouseDown: function(event)
    {
	    var handle = null;
	    
	    // XXX: event.item is not yet implemented in the import/export mechanism. So we do it here instead.
	    var hittest = this.getSharedProject().hitTest(event.point);
	    if(hittest)
	        event.item = hittest.item;
	    
	    if(this.state.currentSegment)
            this.state.currentSegment.selected = false;
	    
	    if(this.state.currentCurveLocation)
	    {
	        this.state.currentCurveLocation.curve.handle1.selected = false;
	        this.state.currentCurveLocation.curve.handle2.selected = false;
	    }
	    
	    if(this.state.path)
	        handle = this.findHandle(this.state.path, event.point);
	    
        if(handle)
        {
            this.state.currentSegment = handle.segment;
            this.state.currentSegment.selected = true;
            this.state.type = handle.type;
        }
	    else if(event.item)
        {
            if(this.state.path == null)
            {
                this.state.path = event.item;
                this.state.path.selected = true;
            }
            else if(event.item != this.state.path)
            {
                this.resetSelection();
                this.state.path = event.item;
                this.state.path.selected = true;
            } else
            {
                // User might drag a curve.
                this.state.currentCurveLocation = this.state.path.getNearestLocation(event.point);
	            this.state.currentCurveLocation.curve.handle1.selected = true;
	            this.state.currentCurveLocation.curve.handle2.selected = true;
                this.state.type = 'curve';
            }
        }
        else
        {
            this.resetSelection();
        }
    },

    onMouseDrag: function(event) {
	    if(this.state.type)
	    {
		    if (this.state.type == 'point')
		    {
			    this.state.currentSegment.point = event.point;
		    }
		    else if(this.state.type == 'curve')
		    {
		        // This block of code is stolen from inkscape.
		        // http://bazaar.launchpad.net/~inkscape.dev/inkscape/trunk/view/head:/src/ui/tool/curve-drag-point.cpp#L66
		        
                // Magic Bezier Drag Equations follow!
                // "weight" describes how the influence of the drag should be distributed
                // among the handles; 0 = front handle only, 1 = back handle only.
                var weight, t = this.state.currentCurveLocation.parameter;
                if (t <= 1.0 / 6.0) weight = 0;
                else if (t <= 0.5) weight = (Math.pow((6 * t - 1) / 2.0, 3)) / 2;
                else if (t <= 5.0 / 6.0) weight = (1 - Math.pow((6 * (1-t) - 1) / 2.0, 3)) / 2 + 0.5;
                else weight = 1;
                
                var delta = event.point.subtract(event.lastPoint);
                var offset0 = delta.multiply( ((1-weight)/(3*t*(1-t)*(1-t))) );
                var offset1 = delta.multiply( (weight/(3*t*t*(1-t))) );
                
                this.state.currentCurveLocation.curve.segment1.handleOut = this.state.currentCurveLocation.curve.handle1.add( offset0 );
                this.state.currentCurveLocation.curve.segment1.handleIn = this.state.currentCurveLocation.curve.segment1.handleIn.subtract( offset0 ); // Remove this line for sharp corners.
                
                this.state.currentCurveLocation.curve.segment2.handleIn = this.state.currentCurveLocation.curve.handle2.add( offset1 );
                this.state.currentCurveLocation.curve.segment2.handleOut = this.state.currentCurveLocation.curve.segment2.handleOut.subtract( offset1 ); // Remove this line for sharp corners.
		    }
		    else
		    {
		        // type is 'handleOut' or 'handleIn'
			    var delta = event.delta.clone();
			    if (this.state.type == 'handleOut')
				    delta = -delta;
			    this.state.currentSegment.handleIn += delta;
			    this.state.currentSegment.handleOut -= delta;
		    }
	    }
    },
    
    onMouseUp: function(event) {
        this.state.type = null;
	    if(this.state.currentCurveLocation)
	    {
	        this.state.currentCurveLocation.curve.handle1.selected = false;
	        this.state.currentCurveLocation.curve.handle2.selected = false;
	    }
        this.state.currentCurveLocation = null;
    },
});

ToolDescriptions.push( EditDescription );

