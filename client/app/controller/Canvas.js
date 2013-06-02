Ext.define('DD.controller.Canvas', {
    extend: 'Ext.app.Controller',

    init: function() {
        this.control({
            'panel#canvasPanel': {
                render: this.onPanelRendered,
                resize: this.onResize
            }
        });
    },

    onPanelRendered: function() {
        this.html5_canvas = document.getElementById('html5_canvas');
        
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
    },
    
    onResize: function(container, width, height, oldWidth, oldHeight, eOpts) {
        // XXX: The width and height of the resized container include some decoration.
        // We should include it in our calculation, but I can't seem to find a programic way to obtain that information.
        // This is not portable, the size of the decorations might change.
        // A additional reason this is unportable is if you zoom in.
        this.html5_canvas.width = width-18;
        this.html5_canvas.height = height-18;
        paper.view.draw();
    }
});
