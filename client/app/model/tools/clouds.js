
var CloudsDescription = new DD.model.tools.ToolDescription({
    uuid : '1284d96b-41c0-44b9-b8fe-fffc2d78ee25',
    version : '0.0.0',
    deprecated : false,
    icon : null,
    name : 'Clouder',
    description : "Can't draw clouds? Now you can.",
    minDistance : 30,
    
    onMouseDown : function(event) {
        this.state.path = new this.paper.Path();
        this.state.path.strokeColor = 'black';
        this.state.path.add(event.point);
    },

    onMouseDrag : function(event) {
        this.state.path.arcTo(event.point);
    },
});

ToolDescriptions.push( CloudsDescription );
