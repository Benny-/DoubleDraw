
tool_creator.push( function(paper){
    
    with (paper)
    {
        var cutom_tool = new Tool();
        var path = new Path();
        path.strokeColor = 'black';
    
        // Define a mousedown and mousedrag handler
        cutom_tool.onMouseDown = function(event) {
            path = new Path();
            path.strokeColor = 'black';
            path.add(event.point);
        }
    
        cutom_tool.onMouseDrag = function(event) {
            path.add(event.point);
        }
        return cutom_tool;
    }
    
});
