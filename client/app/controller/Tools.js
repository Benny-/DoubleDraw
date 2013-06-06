Ext.define('DD.controller.Tools', {
    extend: 'Ext.app.Controller',

    views: [
        'Tools'
    ],

    init: function() {
        
        this.control({
            'tools': {
                // XXX. We are only listening to this event to obtain our tools view object.
                // There should be another easy way to obtain our views reference.
                // Now there is a race condition, if the views are rendered differently,
                // we might miss the "PaperReady" event (see below).
                render: this.onPanelRendered,
            }
        });
    },
    
    onPanelRendered: function(panel) {
        
        var self = this;
        this.application.on("PaperReady", function() {
            
            var proxy_tool;
            with (paper)
            {
                proxy_tool = new Tool();
            }
            proxy_tool.app = self.application;
            
            proxy_tool.withinPlayfield = false;
            proxy_tool.app.canvas.onmouseover=function(){
               proxy_tool.withinPlayfield = true;
            };
            
            proxy_tool.app.canvas.onmouseout=function(){
                proxy_tool.withinPlayfield = false;
            };
            
            proxy_tool.onMouseDown = function(event) {
                console.log(event);
            }
        
            proxy_tool.onMouseDrag = function(event) {
                console.log(event);
            }
            
            proxy_tool.onMouseUp = function(event) {
                console.log(event);
            }
            
            proxy_tool.onMouseMove = function(event) {
                if(this.withinPlayfield)
                {
                    this.app.socket.emit("user::move", {point : event.point} )
                    this.serverOffscreenKnown = false;
                }
                else
                {
                    if(!this.serverOffscreenKnown)
                    {
                        this.app.socket.emit("user::move::offscreen")
                        this.serverOffscreenKnown = true;
                    }
                }
            }
            
            proxy_tool.onMouseUp = function(event) {
                console.log("onMouseUp");
            }
            
            for (var i = 0; i < tool_creator.length; i++) {
                var tmp = function(tool){
                    console.log(tool)
                    panel.add(
                    Ext.create('Ext.Button', {
                        text: 'Click me',
                        renderTo: Ext.getBody(),
                        handler: function() {
                            console.log( tool )
                            tool.activate();
                        }
                    }));
                };
                tmp(tool_creator[i](self.application.paper));
                // I will never understand javascript scope.
            }
            
            proxy_tool.activate();
        })
    },
});
