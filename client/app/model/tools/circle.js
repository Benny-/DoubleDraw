
var CircleDescription = new DD.model.tools.ToolDescription({
    uuid : 'f751b0f5-8b07-4644-bc29-2795e816bb15',
    version : '0.0.0',
    deprecated : false,
    icon : null,
    name : 'Circle',
    description : 'Perfection',
    
    
    onMouseDown : function(event) {
        this.state.start = event.point;
        this.state.path = new this.paper.Path.Circle(event.point, 0);
        this.state.path.strokeColor = this.getColor();
    },

    onMouseDrag : function(event) {
        this.state.path.remove(); // TODO: Don't remove the path but alter the existing path.
        this.state.path = new this.paper.Path.Circle(this.state.start, new this.paper.Point(event.point).getDistance(this.state.start));
        this.state.path.strokeColor = this.getColor();
    },
});

ToolDescriptions.push( CircleDescription );
