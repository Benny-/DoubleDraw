
Ext.define('DD.model.User', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id',   type: 'int'}, // id is unique for every User object but only on the local client.
        {name: 'user_id', type: 'int'}, // user_id is unique for every User object and is the same on every client. A user gets a new user_id if he/she reconnects (a page refresh).
        {name: 'nickname', type: 'string'},
    ],
});
