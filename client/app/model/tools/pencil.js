
var Pencil = paper.Tool.extend({
    uuid : '382954a0-61c9-4009-9a95-637b21c00eff',
    version : '0.0.0',
    deprecated : false,
    icon : null,
    name : 'Pencil',
    description : "Nothing can beat the mighty pencil",
    
    
    initialize: function Pencil() {
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
        this.state.path.add(event.point);
    },
});

ToolClasses.push( Pencil );
