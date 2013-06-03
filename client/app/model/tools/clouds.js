
tool_creator.push( function(paper){
    
    with (paper)
    {
        var cutom_tool = new Tool();
        cutom_tool.minDistance = 30;
        var path;

        cutom_tool.onMouseDown = function(event) {
            path = new Path();
            path.strokeColor = 'black';
            path.add(event.point);
        }

        cutom_tool.onMouseDrag = function(event) {
            // Use the arcTo command to draw cloudy lines
            path.arcTo(event.point);
        }

        return cutom_tool;
    }
    
});
