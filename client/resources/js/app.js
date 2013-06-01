
paper.install(window);
window.onload = function() {
    
    paper.setup("html5_canvas");
    
    with (paper)
    {
        var path = new Path();
        path.strokeColor = 'black';
        var start = new Point(100, 100);
        path.moveTo(start);
        path.lineTo(start.add([ 200, -50 ]));
        view.draw();
        
        
        var tool = new Tool();
        var path;
    
        // Define a mousedown and mousedrag handler
        tool.onMouseDown = function(event) {
            path = new Path();
            path.strokeColor = 'black';
            path.add(event.point);
        }
    
        tool.onMouseDrag = function(event) {
            path.add(event.point);
        }
    }
    paper.view.draw();
    
    var socket = io.connect('http://localhost');
    socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', { my: 'data' });
    });
    
}
