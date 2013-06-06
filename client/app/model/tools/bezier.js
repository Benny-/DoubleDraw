
tool_creators.push( function(paper){
    
    with (paper)
    {
    	var path;
        var cutom_tool = new Tool();
		var types = ['point', 'handleIn', 'handleOut'];
		function findHandle(point) {
			for (var i = 0, l = path.segments.length; i < l; i++) {
				for (var j = 0; j < 3; j++) {
					var type = types[j];
					var segment = path.segments[i];
					var segmentPoint = type == 'point'
							? segment.point
							: segment.point + segment[type];
					var distance = (point - segmentPoint).length;
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

		var currentSegment, mode, type;
		cutom_tool.onMouseDown = function(event) {
			if (currentSegment)
				currentSegment.selected = false;
			mode = type = currentSegment = null;

			if (!path) {
				path = new Path();
				path.fillColor = {
					hue: 360 * Math.random(),
					saturation: 1,
					brightness: 1,
					alpha: 0.5
				};
			}

			var result = findHandle(event.point);
			if (result) {
				currentSegment = result.segment;
				type = result.type;
				if (path.segments.length > 1 && result.type == 'point'
						&& result.segment.index == 0) {
					mode = 'close';
					path.closed = true;
					path.selected = false;
					path = null;
				}
			}

			if (mode != 'close') {
				mode = currentSegment ? 'move' : 'add';
				if (!currentSegment)
					currentSegment = path.add(event.point);
				currentSegment.selected = true;
			}
		}

		cutom_tool.onMouseDrag = function(event) {
			if (mode == 'move' && type == 'point') {
				currentSegment.point = event.point;
			} else if (mode != 'close') {
				var delta = event.delta.clone();
				if (type == 'handleOut' || mode == 'add')
					delta = -delta;
				currentSegment.handleIn += delta;
				currentSegment.handleOut -= delta;
			}
		}
        
        return cutom_tool;
    }
    
});
