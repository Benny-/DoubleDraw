
Ext.define('DD.view.Users' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.users',
    
    store: 'Users',
    //store: 'usersStore',
    
    initComponent: function() {
        
        this.columns = [
            {header: 'id',  dataIndex: 'user_id',},
            {header: 'Nickname',  dataIndex: 'nickname',},
        ];

        this.callParent(arguments);
    }
});
