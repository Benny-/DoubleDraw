
var BoxDescription = new DD.model.tools.ToolDescription({
    uuid : 'b7f2da30-a9d8-4274-96ae-9edd7c9b7703',
    version : '0.0.0',
    deprecated : false,
    icon : null,
    name : 'Boxer',
    description : "This tool is used since ancient times to draw boxes",
    
    
    onMouseDown : function(event) {
        this.state.start = event.point;
        this.state.rectangle = new this.paper.Rectangle( event.point, 1 );
        this.state.path = new this.paper.Path.Rectangle(this.state.rectangle);
        this.state.path.strokeColor = this.getColor();
    },

    onMouseDrag : function(event) {
        this.state.rectangle = new this.paper.Rectangle(this.state.start, event.point);
        this.state.path.remove(); // TODO: Don't remove the path but alter the existing path.
        this.state.path = new this.paper.Path.Rectangle(this.state.rectangle);
        this.state.path.strokeColor = this.getColor();
    },
});

ToolDescriptions.push( BoxDescription );
