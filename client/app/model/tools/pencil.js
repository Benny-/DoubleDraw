
var PencilDescription = new DD.model.tools.ToolDescription({
    uuid : '382954a0-61c9-4009-9a95-637b21c00eff',
    version : '0.0.0',
    deprecated : false,
    icon : null,
    name : 'Pencil',
    description : "Nothing can beat the mighty pencil",
    
    onMouseDown : function(event) {
        this.state.path = new this.paper.Path();
        this.state.path.strokeColor = this.user.getPaperColor();
        this.state.path.add(event.point);
    },

    onMouseDrag : function(event) {
        this.state.path.add(event.point);
    },
});

ToolDescriptions.push( PencilDescription );
