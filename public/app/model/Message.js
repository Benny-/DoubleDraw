
// This message class is used for chat messages.

Ext.define('DD.model.Message', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id',   type: 'int'},
        {name: 'user_id', type: 'int'},
        {name: 'nickname', type: 'string'}, // The nickname at the time this message was send. The user might have another nickname now.
        {name: 'text', type: 'string'}, // Plain text
        {name: 'sendDate', type: 'date'}, // Filled by the sender
        {name: 'processedDate', type: 'date'}, // Filled by the server
        {name: 'receiveDate', type: 'date'}, // filled by the receiver
    ],
});
