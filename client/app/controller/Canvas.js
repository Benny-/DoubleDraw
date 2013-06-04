Ext.define('DD.controller.Canvas', {
    extend: 'Ext.app.Controller',
    
    views: [
        'Canvas'
    ],
    
    init: function() {
        this.control({
            'panel#canvasPanel': {
                render: this.onPanelRendered,
                resize: this.onResize
            }
        });
    },

    onPanelRendered: function(panel) {
        this.application.canvas = document.getElementById('html5_canvas');
        this.application.paper.setup('html5_canvas');
        
        this.application.fireEvent("PaperReady", this.application.canvas, this.application.paper);
    },
    
    // The onRezie function resizes the html canvas match the outer container.
    // TODO: Consider moving this to a view class.
    onResize: function(container, width, height, oldWidth, oldHeight, eOpts) {
        // XXX: The width and height of the resized container include some decoration.
        // We should include it in our calculation, but I can't seem to find a programic way to obtain that information.
        // This is not portable, the size of the decorations might change.
        // A additional reason this is unportable is if you zoom in.
        this.application.canvas.width = width-18;
        this.application.canvas.height = height-18;
        this.application.paper.view.draw();
    }
});
