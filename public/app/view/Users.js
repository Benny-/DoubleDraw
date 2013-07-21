
Ext.define('DD.view.Users' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.users',
    
    store: 'Users',
    columns: [
        {header: 'id',  dataIndex: 'user_id',},
        {header: 'Nickname',  dataIndex: 'nickname',},
    ],
    
    initComponent: function() {
        this.callParent(arguments);
    }
});
