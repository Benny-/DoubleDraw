
Ext.define('DD.controller.Users', {
    extend: 'Ext.app.Controller',
    
    stores: [
        'Users',
        'Messages',
    ],
    
    views: [
        'Users',
        'Chat',
    ],
    
    init: function() {
        
        var Users = Ext.getStore('Users');
        var Messages = Ext.getStore('Messages');
        
        this.application.on("room::entered", function(roomState) {
            Users.removeAll();
            Messages.removeAll();
            for (var i = 0; i < roomState.sharedPaper.users.length; i++) {
                var existing_user = roomState.sharedPaper.users[i];
                var user = Ext.create('DD.model.User', existing_user);
                Users.add(user);
            }
        });
        
        this.application.on("room::user::leave", function(leaving_user) {
            var user = Users.findRecord("user_id",leaving_user.user_id);
            Users.remove(user);
        });
        
        this.application.on("room::user::new", function(entering_user) {
            var user = Ext.create('DD.model.User', entering_user);
            Users.add(user);
        });
        
        this.control({
            
            'chat#main_chat textfield': {
                specialkey: this.onChatKeyDown,
            },
            
        });
        
        this.application.on("user::chat", function(message_primitive) {
            message_primitive.receiveDate = new Date();
            var message = Ext.create("DD.model.Message", message_primitive);
            Messages.add(message);
        });
        
    },
    
    onChatKeyDown: function( textfield, event ) {
        if(event.getKey() == event.ENTER && textfield.getValue() != "")
        {
            var message = {
                sendDate: new Date(),
                text: textfield.getValue(),
            };
            this.application.socket.emit('user::chat', message );
            textfield.setValue("");
        }
    },
    
});
