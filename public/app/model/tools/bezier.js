
var BezierDescription = new DD.model.tools.ToolDescription({
    uuid : '',
    version : '0.0.0',
    deprecated : false,
    icon : null,
    name : 'Bezier',
    description : "The pencil is for those who don't understand vectors",
    
    toolInit: function() {
        this.state.currentSegment = null;
        this.state.mode = null;
        this.state.type = null;
        this.types = ['point', 'handleIn', 'handleOut'];
    },
    
    onMouseDown : function(event) {
        function findHandle(point) {
			for (var i = 0, l = this.state.path.segments.length; i < l; i++) {
				for (var j = 0; j < 3; j++) {
					var type = this.types[j];
					var segment = this.state.path.segments[i];
					var segmentPoint = type == 'point'
							? segment.point
							: segment.point.add(segment[type]);
					var distance = point.subtract(segmentPoint).length;
					if (distance < 3) {
						return {
							type: type,
							segment: segment
						};
					}
				}
			}
			return null;
		}
        
		if (this.state.currentSegment)
			this.state.currentSegment.selected = false;
		this.state.mode = this.state.type = this.state.currentSegment = null;

		if (!this.state.path) {
			this.state.path = new this.paper.Path();
			this.state.path.fillColor = {
				hue: 360 * Math.random(),
				saturation: 1,
				brightness: 1,
				alpha: 0.5
			};
		}
		var result = findHandle.call(this, event.point);
		if (result) {
			this.state.currentSegment = result.segment;
			this.state.type = result.type;
			if (this.state.path.segments.length > 1 && result.type == 'point'
					&& result.segment.index == 0) {
				this.state.mode = 'close';
				this.state.path.closed = true;
				this.state.path.selected = false;
				this.state.path = null;
			}
		}

		if (this.state.mode != 'close') {
			this.state.mode = this.state.currentSegment ? 'move' : 'add';
			if (!this.state.currentSegment)
				this.state.currentSegment = this.state.path.add(event.point);
			this.state.currentSegment.selected = true;
		}
    },

    onMouseDrag : function(event) {
		if (this.state.mode == 'move' && this.state.type == 'point') {
			this.state.currentSegment.point = event.point;
		} else if (this.state.mode != 'close') {
			var delta = event.delta;
			if (this.state.type == 'handleOut' || this.state.mode == 'add')
			{
                delta.x = -delta.x;
                delta.y = -delta.y;
			}
            this.state.currentSegment.handleIn.x += delta.x;
            this.state.currentSegment.handleIn.y += delta.y;
            
			this.state.currentSegment.handleOut.x -= delta.x;
            this.state.currentSegment.handleOut.y -= delta.y;
		}
    },
    
});

ToolDescriptions.push( BezierDescription );
