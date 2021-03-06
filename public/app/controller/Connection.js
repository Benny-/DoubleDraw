
// This controller listens for connect/disconnect events
// and updates a bit of text on the status bar.

// This controller does not start or
// manage the connection to the server.
// See "app.js" for that.

Ext.define('DD.controller.Connection', {
    extend: 'Ext.app.Controller',
    
    init: function() {
        var me = this;
        
        this.control({
        
            'tbtext#connectionStatus': {
                render: this.onConnectionStatusViewRendered,
            },
            
        });
        
        this.application.on("server::connect", function(user_id) {
            console.log("socket.io connection to DD server established");
            me.connectionStatusView.setText("Connected");
        });
        
        this.application.on("server::disconnect", function(user_id) {
            console.log("socket.io connection to DD server lost");
            me.connectionStatusView.setText("<strong>Disconnected</strong>");
        });
        
    },
    
    onConnectionStatusViewRendered: function(view, eOpts)
    {
        this.connectionStatusView = view;
    },
    
});

