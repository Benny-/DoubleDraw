
tool_creators.push( function(paper){
    
    with (paper)
    {
        var cutom_tool = new Tool();
        
    	var values  = {
			minDistance: 10,
			maxDistance: 30,
			varyThickness: true
		};

		/////////////////////////////////////////////////////////////////////
		// Mouse handling

		cutom_tool.minDistance = values.minDistance;
		cutom_tool.maxDistance = values.maxDistance;

		var worm;

		// Every time the user clicks the mouse to drag we create a path
		// and when a user drags the mouse we add points to it
		cutom_tool.onMouseDown = function(event) {
			worm = new Path();
            worm.fillColor = 'white';
            worm.strokeColor = 'black';
			worm.add(event.point, event.point);
			worm.closed = true;
		}

		cutom_tool.onMouseDrag = function(event) {
			// the vector in the direction that the mouse moved
			var step = event.delta;

			// if the vary thickness checkbox is marked
			// divide the length of the step vector by two:
			if (values.varyThickness) {
				step.length = step.length / 2;
			} else {
				// otherwise set the length of the step vector to half of
				// minDistance
				step.length = values.minDistance / 2;
			}

			// the top point: the middle point + the step rotated by -90
			// degrees
			//   -----*
			//   |
			//   ------
			var top = event.middlePoint + step.rotate(-90);

			// the bottom point: the middle point + the step rotated by 90
			// degrees
			//   ------
			//   |
			//   -----*
			var bottom = event.middlePoint + step.rotate(90);

			// add the top point to the end of the path
			worm.add(top);

			// insert the bottom point after the first segment of the path
			worm.insert(1, bottom);

			// make a new line path from top to bottom
			new Path(top, bottom);

			// This is the point at the front of the worm:
			worm.firstSegment.point = event.point;

			// smooth the segments of the path
			worm.smooth();
		}
        return cutom_tool;
    }
    
});
