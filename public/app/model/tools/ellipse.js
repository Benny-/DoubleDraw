
if( typeof exports !== 'undefined' )
{
    // This code is shared between server and browser.
    // The browser does not know anything about exports or require.
    var paper = require('paper');
}

var EclipseDescription = new DD.model.tools.ToolDescription({
    uuid : 'ad067c59-a9b8-40d3-a2a8-1d2bd33f3437',
    version : '0.0.0',
    deprecated : false,
    icon : null,
    name : 'Ellipse',
    description : 'Faulty circles at a discount',
    
    
    onMouseDown : function(event) {
        this.state.start = event.point;
        this.state.rectangle = new paper.Rectangle( event.point, 1 );
        this.state.path = new paper.Path.Ellipse(this.state.rectangle);
        this.state.path.strokeColor = this.getColor();
    },

    onMouseDrag : function(event) {
        this.state.rectangle = new paper.Rectangle(this.state.start, event.point);
        this.state.path.remove(); // TODO: Don't remove the path but alter the existing path.
        this.state.path = new paper.Path.Ellipse(this.state.rectangle);
        this.state.path.strokeColor = this.getColor();
    },
});

ToolDescriptions.push( EclipseDescription );
