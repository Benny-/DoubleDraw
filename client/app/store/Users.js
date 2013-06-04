
Ext.define('DD.store.Users', {
    extend: 'Ext.data.Store',
    model: 'DD.model.User',
    storeId: 'usersStore', // Use this id to connect to the singleton Users store.
    
    data: [
        
    ]
});
