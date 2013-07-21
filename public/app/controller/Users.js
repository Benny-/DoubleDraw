
Ext.define('DD.controller.Users', {
    extend: 'Ext.app.Controller',
    
    stores: [
        'Users'
    ],
    
    views: [
        'Users'
    ],
    
    init: function() {
        
        var store = Ext.getStore('Users');
        this.application.on("room::entered", function(roomState) {
            store.removeAll();
            for (var i = 0; i < roomState.sharedPaper.users.length; i++) {
                var existing_user = roomState.sharedPaper.users[i];
                var user = Ext.create('DD.model.User', existing_user);
                store.add(user);
            }
        });
        
        this.application.on("room::user::leave", function(leaving_user) {
            var user = store.findRecord("user_id",leaving_user.user_id);
            store.remove(user);
        });
        
        this.application.on("room::user::new", function(entering_user) {
            var user = Ext.create('DD.model.User', entering_user);
            store.add(user);
        });
        
    },
    
});
