
if( typeof exports !== 'undefined' )
{
    // This code is shared between server and browser.
    // The browser does not know anything about exports or require.
    var paper = require('paper');
}

var TextDescription = new DD.model.tools.ToolDescription({
    uuid : '32504ecd-1244-4408-a2fb-af63a3926152',
    version : '0.0.0',
    deprecated : false,
    icon : null,
    name : 'Text',
    description : "Write in the clouds",
    
    toolInit: function()
    {
        this.state.text = null;
    },
    
    onMouseDown: function(event) {
        this.state.text = new paper.PointText( event.point );
        this.state.text.fillColor = this.getColor();
        this.state.text.content = '';
    },
    
    onMouseDrag: function(event) {
        this.state.text.position = event.point;
    },
    
    onMouseUp: function(event) {
        this.state.text.position = event.point;
    },
    
    onKeyDown: function(event) {
        var text = this.state.text;
        if(text)
        {
            if(event.key == 'space')
                text.content = text.content + ' ';
            else if(event.key == 'backspace')
                text.content = text.content.substr(0, text.content.length - 1);
            else
                text.content = text.content + event.character;
        }
    },
    
});

ToolDescriptions.push( TextDescription );

