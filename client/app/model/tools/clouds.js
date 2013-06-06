
var Clouds = paper.Tool.extend({
    uuid : '1284d96b-41c0-44b9-b8fe-fffc2d78ee25',
    version : '0.0.0',
    deprecated : false,
    icon : null,
    name : 'Clouder',
    description : "Can't draw clouds? Now you can.",
    minDistance : 30,
    
    initialize: function Clouds() {
        this.state = {};
        paper.Tool.apply(this, arguments);
        
        this.on("mousedown", (this.onMouseDown));
        this.on("mousedrag", (this.onMouseDrag));
        // this.on("mouseup", (this.onMouseUp));
        // this.on("keydown", (this.onKeyDown));
        // this.on("keyup", (this.onKeyUp));
    },
    
    onMouseDown : function(event) {
        this.state.path = new paper.Path();
        this.state.path.strokeColor = 'black';
        this.state.path.add(event.point);
    },

    onMouseDrag : function(event) {
        this.state.path.arcTo(event.point);
    },
});

ToolClasses.push( Clouds );
