
Ext.define('DD.view.Chat' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.chat',
    
    title: 'Chat',
    store: 'Messages',
    
    columns: [
        {
            header: 'Time',
            dataIndex: 'processedDate',
            hidden: true,
        },
        {
            header: 'Send time',
            dataIndex: 'sendDate',
            hidden: true,
        },
        {
            header: 'Receive time',
            dataIndex: 'receiveDate',
            hidden: true,
        },
        {
            header: 'User id',
            dataIndex: 'user_id',
            width: 45,
            hidden: true,
        },
        {
            header: 'Nickname',
            renderer: 'htmlEncode',
            dataIndex: 'nickname',
            width: 70,
        },
        {
            header: 'Message',
            renderer: 'htmlEncode',
            dataIndex: 'text',
            width: 170,
            // flex: 1, // Normally, flex is something good. It makes this column take up all availeble width. Unfortunaly, no scrollbar will be present anymore. So really long messages can no longer be read.
        },
    ],
});
