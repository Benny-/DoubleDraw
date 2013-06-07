Ext.define('DD.controller.Tools', {
    extend: 'Ext.app.Controller',

    views: [
        'Tools'
    ],
    
    sharedDrawingContext : new SharedDrawingContext(),
    
    init: function() {
        
        var controller = this;
        
        this.control({
            'tools': {
                // XXX. We are only listening to this event to obtain our tools view object.
                // There should be another easy way to obtain our views reference.
                // Now there is a race condition, if the views are rendered differently,
                // we might miss the "PaperReady" event (see below).
                render: this.onPanelRendered,
            }
        });
        
        this.application.on("room::entered", function(room_state) {
            controller.sharedDrawingContext.removeAllUsers();
            for (var i = 0; i < room_state.users.length; i++) {
                controller.sharedDrawingContext.addUser(room_state.users[i]);
            }
            controller.sharedDrawingContext.addUser(room_state.user);
        });
        
        this.application.on("room::user::leave", function(user) {
            controller.sharedDrawingContext.removeUser(user);
        });
        
        this.application.on("room::user::new", function(user) {
            controller.sharedDrawingContext.addUser(user);
        });
        
        this.application.on("user::tool::change", function(tool_change) {
            console.log(tool_change);
        });
        
        this.application.on("user::tool::onMouseDown", function(json_event) {
            controller.sharedDrawingContext.addJSONEvent(json_event);
            controller.application.paper.view.draw();
        });
        
        this.application.on("user::tool::onMouseDrag", function(json_event) {
            controller.sharedDrawingContext.addJSONEvent(json_event);
            controller.application.paper.view.draw();
        });
        
        this.application.on("user::tool::onMouseUp", function(json_event) {
            controller.sharedDrawingContext.addJSONEvent(json_event);
            controller.application.paper.view.draw();
        });
    },
    
    onPanelRendered: function(panel) {
        
        var controller = this;
        this.application.on("PaperReady", function() {
            
            var proxy_tool;
            with (paper)
            {
                proxy_tool = new Tool();
            }
            proxy_tool.app = controller.application;
            
            proxy_tool.withinPlayfield = false;
            proxy_tool.app.canvas.onmouseover=function(){
               proxy_tool.withinPlayfield = true;
            };
            
            proxy_tool.app.canvas.onmouseout=function(){
                proxy_tool.withinPlayfield = false;
            };
            
            // Returns a dict, not a string.
            // The returned dict will contain only the essential parts about the event.
            proxy_tool.eventToJSON = function(event)
            {
                return {
                    type: event.type,
                    point: { x: event.point.x, y: event.point.y},
                    lastPoint: (event.lastPoint ? { x: event.lastPoint.x, y: event.lastPoint.y} : null),
                    downPoint: event.downPoint ? { x: event.downPoint.x, y: event.downPoint.y} : null,
                    //middlePoint: event.middlePoint, // Causes stack overflow.
                    delta: event.delta,
                    count: event.count,
                    // item: {
                    //     id : event.item.id,
                    // }
                }
            }
            
            proxy_tool.onMouseDown = function(event) {
                console.log(event)
                this.app.socket.emit("user::tool::onMouseDown", this.eventToJSON(event) )
            }
        
            proxy_tool.onMouseDrag = function(event) {
                console.log(event)
                this.app.socket.emit("user::tool::onMouseDrag", this.eventToJSON(event) )
            }
            
            proxy_tool.onMouseUp = function(event) {
                console.log(event)
                this.app.socket.emit("user::tool::onMouseUp", this.eventToJSON(event) )
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
            
            for (var i = 0; i < ToolClasses.length; i++) {
                controller.sharedDrawingContext.addToolClass(ToolClasses[i]);
                var tmp = function(ToolClass){
                    panel.add(
                    Ext.create('Ext.Button', {
                        text: ToolClass.name,
                        tooltip: ToolClass.description,
                        renderTo: Ext.getBody(),
                        handler: function() {
                            controller.application.socket.emit("user::tool::change",
                            {
                                uuid : ToolClass.uuid,
                            });
                        }
                    }));
                };
                tmp( ToolClasses[i] );
                // I will never understand javascript scope.
            }
            
            proxy_tool.activate();
        })
    },
    
    
});
