
tool_creator.push( function(paper){
    
    with (paper)
    {
        var tool;
        var path = new Path();
        path.strokeColor = 'black';
        
        tool = new Tool();
    
        // Define a mousedown and mousedrag handler
        tool.onMouseDown = function(event) {
            path = new Path();
            path.strokeColor = 'black';
            path.add(event.point);
        }
    
        tool.onMouseDrag = function(event) {
            path.add(event.point);
        }
        return tool;
    }
    
});
