
Ext.define('DD.controller.Users', {
    extend: 'Ext.app.Controller',
    
    stores: ['Users'],
    views: [
        'Users'
    ],
    
    init: function() {
        
        var store = Ext.getStore('Users');
        this.application.on("room::entered", function(room_state) {
            store.removeAll();
            for (var i = 0; i < room_state.users.length; i++) {
                var existing_user = room_state.users[i];
                var user = Ext.create('DD.model.User', {
                    user_id: existing_user.user_id,
                    nickname: "Anon",
                });
                store.add(user);
            }
        });
        
        this.application.on("room::user::leave", function(leaving_user) {
            var user = store.findRecord("user_id",leaving_user.user_id);
            store.remove(user);
        });
        
        this.application.on("room::user::new", function(entering_user) {
            var user = Ext.create('DD.model.User', {
                user_id: entering_user.user_id,
                nickname: "Anon",
            });
            store.add(user);
        });
        
    },
    
});
