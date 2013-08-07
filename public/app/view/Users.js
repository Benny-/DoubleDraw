
Ext.define('DD.view.Users' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.users',
    
    store: 'Users',
    columns: [
        {
            header: 'id',
            dataIndex: 'user_id',
            width: 40,
        },
        {
            header: 'Nickname',
            dataIndex: 'nickname',
            renderer: 'htmlEncode',
            flex: 1,
        },
    ],
    
    initComponent: function() {
        this.callParent(arguments);
    }
});
