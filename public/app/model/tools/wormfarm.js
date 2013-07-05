
var WormFarmDescription = new DD.model.tools.ToolDescription({
    uuid : 'dc1120a7-5ed3-4c93-8f9e-6971289b6a81',
    version : '0.0.0',
    deprecated : false,
    icon : null,
    name : 'WormFarm',
    description : "Slimy!",
	minDistance: 10,
	maxDistance: 30,
    
    onMouseDown : function(event) {
        this.state.worm = new this.paper.Path();
        this.state.worm.strokeColor = this.getColor();
        this.state.worm.add(event.point, event.point);
        this.state.worm.closed = true;
    },
    
    onMouseDrag: function(event) {
		// the vector in the direction that the mouse moved
		var step = event.delta;

        step.length = step.length / 2;
        
		// the top point: the middle point + the step rotated by -90
		// degrees
		//   -----*
		//   |
		//   ------
		var top = event.middlePoint.add(step.rotate(-90));

		// the bottom point: the middle point + the step rotated by 90
		// degrees
		//   ------
		//   |
		//   -----*
		var bottom = event.middlePoint.add(step.rotate(90));

		// add the top point to the end of the path
		this.state.worm.add(top);

		// insert the bottom point after the first segment of the path
        
		this.state.worm.insert(1, bottom);

		// make a new line path from top to bottom
		var path = new this.paper.Path(top, bottom);
        path.fillColor = 'white';
        path.strokeColor = 'black';
        
        
		// This is the point at the front of the worm:
		this.state.worm.firstSegment.point = event.point;

		// smooth the segments of the path
		this.state.worm.smooth();
	}
});

ToolDescriptions.push( WormFarmDescription );
